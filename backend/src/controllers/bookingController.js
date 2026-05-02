const Booking = require('../models/Booking');
const SlotInventory = require('../models/SlotInventory');
const AppointmentType = require('../models/AppointmentType');

exports.createBooking = async (req, res, next) => {
  try {
    const { appointmentId, providerUserId, resourceId, bookingDate, startTime, endTime, selectedCapacity = 1, answers, paymentMock } = req.body;

    if (!appointmentId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required booking details.' });
    }

    const appt = await AppointmentType.findById(appointmentId).populate('assignedUsers').populate('assignedResources');
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });

    let finalProviderId = providerUserId;
    let finalResourceId = resourceId;

    if (appt.assignmentMode === 'automatic') {
      if (appt.bookingType?.type === 'resource') {
        if (!finalResourceId && appt.assignedResources?.length > 0) {

          for (const resItem of appt.assignedResources) {
            const slotCheck = await SlotInventory.findOne({
              appointment: appointmentId,
              date: bookingDate,
              startTime,
              resource: resItem._id,
              status: 'available'
            });

            const cap = appt.capacity?.manageCapacity ? (appt.capacity.capacityPerSlot || appt.capacity.maxSimultaneous || 1) : 1;
            if (!slotCheck || (slotCheck.bookedCount + selectedCapacity <= slotCheck.capacity)) {
              finalResourceId = resItem._id;
              break;
            }
          }
          if (!finalResourceId) return res.status(409).json({ success: false, message: 'No resources available for this time.' });
        }
      } else {
        if (!finalProviderId && appt.assignedUsers?.length > 0) {
          for (const userItem of appt.assignedUsers) {
            const slotCheck = await SlotInventory.findOne({
              appointment: appointmentId,
              date: bookingDate,
              startTime,
              providerUser: userItem._id,
              status: 'available'
            });
            const cap = appt.capacity?.manageCapacity ? (appt.capacity.capacityPerSlot || appt.capacity.maxSimultaneous || 1) : 1;
            if (!slotCheck || (slotCheck.bookedCount + selectedCapacity <= slotCheck.capacity)) {
              finalProviderId = userItem._id;
              break;
            }
          }
          if (!finalProviderId) return res.status(409).json({ success: false, message: 'No providers available for this time.' });
        }
      }
    }

    const capConfig = appt.capacity || {};
    let finalCapacity = 1;
    if (capConfig.manageCapacity) {
      finalCapacity = capConfig.capacityPerSlot || capConfig.maxSimultaneous || 1;
    } else {

      req.body.selectedCapacity = 1;
    }

    const slotQuery = {
      appointment: appointmentId,
      date: bookingDate,
      startTime
    };
    if (finalProviderId) slotQuery.providerUser = finalProviderId;
    if (finalResourceId) slotQuery.resource = finalResourceId;

    let slot = await SlotInventory.findOne(slotQuery);
    if (!slot) {

      slot = new SlotInventory({
        ...slotQuery,
        endTime,
        capacity: finalCapacity,
        bookedCount: 0,
        status: 'available'
      });
      await slot.save();
    }

    const updatedSlot = await SlotInventory.findOneAndUpdate(
      {
        _id: slot._id,
        status: { $ne: 'blocked' },
        bookedCount: { $lte: slot.capacity - selectedCapacity }
      },
      {
        $inc: { bookedCount: selectedCapacity }
      },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(409).json({ success: false, message: 'Slot is no longer available or not enough capacity. Please choose another time.' });
    }

    if (updatedSlot.bookedCount >= updatedSlot.capacity) {
      updatedSlot.status = 'full';
      await updatedSlot.save();
    }

    const manualConfirmation = appt.options?.manualConfirmation || false;
    const status = manualConfirmation ? 'pending' : 'confirmed';

    const advancePayment = appt.options?.advancePayment || false;
    let payment = { required: false, status: 'not_required' };

    if (advancePayment) {
      payment.required = true;
      payment.amount = appt.options.paymentAmount || 0;
      if (paymentMock) {
        payment.status = 'paid';
        payment.mockTransactionId = `txn_${Date.now()}`;
      } else {
        payment.status = 'pending';
      }
    }

    const newBooking = new Booking({
      customer: req.user.id,
      appointment: appointmentId,
      organiser: appt.createdBy,
      providerUser: providerUserId,
      resource: resourceId,
      bookingDate,
      startTime,
      endTime,
      selectedCapacity,
      answers: answers || [],
      status,
      payment
    });

    await newBooking.save();

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('appointment', 'basicInfo')
      .populate('providerUser', 'fullName')
      .populate('resource', 'name code')
      .sort({ bookingDate: 1, startTime: 1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('appointment')
      .populate('providerUser', 'fullName')
      .populate('resource', 'name code')
      .populate('customer', 'fullName email');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.customer.toString() !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.status = 'cancelled';
    booking.cancel = { cancelledAt: new Date(), reason };
    await booking.save();

    const slotQuery = {
      appointment: booking.appointment,
      date: booking.bookingDate,
      startTime: booking.startTime
    };
    if (booking.providerUser) slotQuery.providerUser = booking.providerUser;
    if (booking.resource) slotQuery.resource = booking.resource;

    const slot = await SlotInventory.findOne(slotQuery);
    if (slot) {
      slot.bookedCount -= booking.selectedCapacity;
      if (slot.status === 'full' && slot.bookedCount < slot.capacity) {
        slot.status = 'available';
      }
      await slot.save();
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.rescheduleBooking = async (req, res, next) => {
  try {
    const { newDate, newStartTime, newEndTime } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.customer.toString() !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot reschedule this booking.' });
    }

    const newSlotQuery = {
      appointment: booking.appointment,
      date: newDate,
      startTime: newStartTime
    };
    if (booking.providerUser) newSlotQuery.providerUser = booking.providerUser;
    if (booking.resource) newSlotQuery.resource = booking.resource;

    let newSlot = await SlotInventory.findOne(newSlotQuery);
    if (!newSlot) {

      const appt = await AppointmentType.findById(booking.appointment);
      let cap = 1;
      if (appt.capacity?.manageCapacity) cap = appt.capacity.capacityPerSlot || appt.capacity.maxSimultaneous || 1;

      newSlot = new SlotInventory({ ...newSlotQuery, endTime: newEndTime, capacity: cap, bookedCount: 0, status: 'available' });
      await newSlot.save();
    }

    const updatedNewSlot = await SlotInventory.findOneAndUpdate(
      { _id: newSlot._id, status: { $ne: 'blocked' }, bookedCount: { $lte: newSlot.capacity - booking.selectedCapacity } },
      { $inc: { bookedCount: booking.selectedCapacity } },
      { new: true }
    );

    if (!updatedNewSlot) return res.status(409).json({ success: false, message: 'New slot is no longer available.' });

    const oldSlotQuery = { appointment: booking.appointment, date: booking.bookingDate, startTime: booking.startTime };
    if (booking.providerUser) oldSlotQuery.providerUser = booking.providerUser;
    if (booking.resource) oldSlotQuery.resource = booking.resource;

    const oldSlot = await SlotInventory.findOne(oldSlotQuery);
    if (oldSlot) {
      oldSlot.bookedCount -= booking.selectedCapacity;
      if (oldSlot.status === 'full' && oldSlot.bookedCount < oldSlot.capacity) oldSlot.status = 'available';
      await oldSlot.save();
    }

    booking.rescheduleHistory.push({
      oldDate: booking.bookingDate, oldStartTime: booking.startTime, oldEndTime: booking.endTime,
      newDate, newStartTime, newEndTime, changedAt: new Date()
    });

    booking.bookingDate = newDate;
    booking.startTime = newStartTime;
    booking.endTime = newEndTime;

    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    if (!['organiser', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
