const SlotInventory = require('../models/SlotInventory');
const { timeToMinutes, minutesToTime, addMinutes, getDayName, isPastDate } = require('../utils/timeUtils');

exports.getScheduleWindowsForDate = (appointment, dateStr) => {
  if (!appointment?.schedule) return [];
  const { type, flexibleDates, weekly } = appointment.schedule;

  let flexConfigs = flexibleDates?.filter(d => d.date === dateStr && d.isActive);

  if ((!flexConfigs || flexConfigs.length === 0) && weekly && weekly.length > 0) {
    const dayName = getDayName(dateStr);
    flexConfigs = weekly.filter(d => d.day === dayName && d.isActive);
  }

  if (!flexConfigs || flexConfigs.length === 0) return [];

  return flexConfigs.map(c => ({ startTime: c.from, endTime: c.to }));
};

exports.generateSlotsFromWindow = (from, to, durationMin) => {
  const slots = [];
  let currentMins = timeToMinutes(from);
  const endMins = timeToMinutes(to);

  while (currentMins + durationMin <= endMins) {
    slots.push({
      startTime: minutesToTime(currentMins),
      endTime: minutesToTime(currentMins + durationMin)
    });
    currentMins += durationMin;
  }
  return slots;
};

exports.getAvailabilityForAppointment = async (appointment, dateStr, providerUserId = null, resourceId = null) => {
  if (isPastDate(dateStr)) return [];

  const windows = exports.getScheduleWindowsForDate(appointment, dateStr);
  if (!windows.length) return [];

  let durationMin = appointment.basicInfo.duration || 30;
  if (appointment.basicInfo.durationUnit === 'hours') durationMin *= 60;

  const allSlots = [];
  windows.forEach(w => {
    allSlots.push(...exports.generateSlotsFromWindow(w.startTime, w.endTime, durationMin));
  });

  if (!allSlots.length) return [];

  const capConfig = appointment.capacity || {};
  let totalCapacity = 1;
  if (capConfig.manageCapacity) {
    totalCapacity = capConfig.capacityPerSlot || capConfig.maxSimultaneous || 1;
  }

  const query = {
    appointment: appointment._id,
    date: dateStr
  };

  if (providerUserId) query.providerUser = providerUserId;
  if (resourceId) query.resource = resourceId;

  const existingInventories = await SlotInventory.find(query);

  const invMap = {};
  existingInventories.forEach(inv => {
    if (!invMap[inv.startTime]) invMap[inv.startTime] = [];
    invMap[inv.startTime].push(inv);
  });

  const assignedCount = (appointment.bookingType?.type === 'resource'
    ? appointment.assignedResources?.length
    : appointment.assignedUsers?.length) || 1;

  return allSlots.map(slot => {
    const inventories = invMap[slot.startTime] || [];

    let totalBooked = 0;
    let availableEntities = 0;
    let maxRemainingInAny = 0;
    let anyAvailable = false;

    if (providerUserId || resourceId) {

      const inv = inventories[0];
      const bookedCount = inv ? inv.bookedCount : 0;
      const capacity = inv ? inv.capacity : totalCapacity;
      const status = inv ? inv.status : 'available';
      const remaining = Math.max(0, capacity - bookedCount);

      maxRemainingInAny = remaining;
      anyAvailable = status !== 'blocked' && remaining > 0;
      totalBooked = bookedCount;
    } else {

      const bookedInventoriesCount = inventories.length;
      const unbookedCount = Math.max(0, assignedCount - bookedInventoriesCount);

      let bestRemaining = unbookedCount > 0 ? totalCapacity : 0;
      let blockedCount = inventories.filter(i => i.status === 'blocked').length;
      let fullCount = inventories.filter(i => i.status === 'full' || (i.capacity - i.bookedCount <= 0)).length;

      inventories.forEach(inv => {
        const rem = Math.max(0, inv.capacity - inv.bookedCount);
        if (inv.status !== 'blocked' && rem > bestRemaining) bestRemaining = rem;
      });

      maxRemainingInAny = bestRemaining;
      anyAvailable = (unbookedCount > 0 || inventories.some(i => i.status !== 'blocked' && (i.capacity - i.bookedCount > 0)));
    }

    let label = 'Available';
    if (!anyAvailable) label = 'Full';
    else if (maxRemainingInAny > 0 && maxRemainingInAny <= 2 && totalCapacity > 2) label = 'Filling Fast';

    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: totalCapacity,
      remainingCapacity: maxRemainingInAny,
      status: anyAvailable ? 'available' : 'full',
      label
    };
  });
};