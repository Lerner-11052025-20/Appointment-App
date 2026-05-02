import FlexibleScheduleEditor from './FlexibleScheduleEditor';
import { useEffect } from 'react';

export default function ScheduleEditor({ schedule, onChange }) {

  useEffect(() => {
    if (schedule?.scheduleType !== 'flexible') {
      onChange({ ...schedule, scheduleType: 'flexible' });
    }
  }, [schedule?.scheduleType]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
        <span className="text-sm font-bold text-slate-800">Configure Date Availability</span>
        <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded border border-brand-100">Specific Dates</span>
      </div>

      <FlexibleScheduleEditor
        rows={schedule?.flexibleDates || []}
        onChange={f => onChange({ ...schedule, flexibleDates: f, scheduleType: 'flexible' })}
      />
    </div>
  );
}