export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DEFAULT_WEEKLY = [
  { day: 'Monday', from: '09:00', to: '12:00', isActive: true },
  { day: 'Monday', from: '14:00', to: '17:00', isActive: true },
  { day: 'Tuesday', from: '09:00', to: '12:00', isActive: true },
  { day: 'Tuesday', from: '14:00', to: '17:00', isActive: true },
  { day: 'Wednesday', from: '09:00', to: '12:00', isActive: true },
  { day: 'Wednesday', from: '14:00', to: '17:00', isActive: true },
  { day: 'Thursday', from: '09:00', to: '12:00', isActive: true },
];

export const INITIAL_APPOINTMENT = {
  basicInfo: { title: '', description: '', duration: 30, durationUnit: 'minutes', location: '', isOnline: false, imageUrl: '' },
  bookingType: { type: 'user' },
  assignedUsers: [],
  assignedResources: [],
  assignmentMode: 'automatic',
  capacity: { manageCapacity: false, maxSimultaneous: 1, capacityPerSlot: 1 },
  schedule: {
    scheduleType: 'flexible',
    weekly: [],
    flexibleDates: [
      { date: new Date().toISOString().split('T')[0], from: '09:00', to: '12:00', isActive: true },
      { date: new Date().toISOString().split('T')[0], from: '14:00', to: '17:00', isActive: true }
    ]
  },
  questions: [],
  options: { manualConfirmation: false, advancePayment: false, paymentAmount: 0, allowCancellation: true, allowReschedule: true, cancellationWindowHours: 24, rescheduleWindowHours: 24 },
  misc: { internalNotes: '', confirmationMessage: '', venueInstructions: '', additionalTerms: '' },
  publish: { isPublished: false },
};

export const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'yes_no', label: 'Yes / No' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
];

export const countActiveWindows = (weekly = []) => weekly.filter(s => s.isActive).length;