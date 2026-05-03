const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from: formatDateKey(from), to: formatDateKey(to) };
};

const normalizeDateRange = (from, to) => {
  if (!from || !to) return getDefaultDateRange();
  if (!isValidDateString(from) || !isValidDateString(to)) return getDefaultDateRange();
  return { from, to };
};

const buildDateFilter = (from, to) => {
  return { bookingDate: { $gte: from, $lte: to } };
};

const getLastNDays = (n) => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - n);
  return { from: formatDateKey(from), to: formatDateKey(to) };
};

const formatDateKey = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const isValidDateString = (str) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
};

module.exports = { getDefaultDateRange, normalizeDateRange, buildDateFilter, getLastNDays, formatDateKey, isValidDateString };
