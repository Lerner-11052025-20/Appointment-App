import { useState } from 'react';

const WIREFRAME_TYPES = [
  { value: 'text', label: 'Single line text', example: 'e.g., Vipin jindal' },
  { value: 'textarea', label: 'Multi-line text', example: 'e.g., Additional details...' },
  { value: 'tel', label: 'Phone Number', example: 'e.g., 9874563210' },
  { value: 'radio', label: 'Radio(One Answer)', example: 'Option 1' },
  { value: 'checkbox', label: 'Checkboxes(Multiple Answers)', example: 'Option A, Option B' },
];

export default function QuestionBuilder({ questions = [], onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const [newQ, setNewQ] = useState({
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: []
  });

  const remove = (i) => onChange(questions.filter((_, idx) => idx !== i));

  const handleAdd = () => {
    if (!newQ.label.trim()) return;
    onChange([...questions, { ...newQ, order: questions.length }]);
    setNewQ({ label: '', type: 'text', placeholder: '', required: false, options: [] });
    setIsAdding(false);
  };

  const getLabelForType = (type) => {
    return WIREFRAME_TYPES.find(t => t.value === type)?.label || type;
  };

  const needsOptions = (t) => ['radio', 'checkbox'].includes(t);

  return (
    <div className="space-y-6">
      {}
      <div className="border border-brand-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-md shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-brand-50/50 border-b border-brand-100 text-brand-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Question</th>
              <th className="px-4 py-3 font-semibold">Answer type</th>
              <th className="px-4 py-3 font-semibold">Answer (Preview)</th>
              <th className="px-4 py-3 font-semibold text-center">Mandatory</th>
              <th className="px-4 py-3 font-semibold text-center w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questions.map((q, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{q.label}</td>
                <td className="px-4 py-3 text-brand-600 font-medium">{getLabelForType(q.type)}</td>
                <td className="px-4 py-3 italic text-slate-400">{q.placeholder || WIREFRAME_TYPES.find(t => t.value === q.type)?.example || '...'}</td>
                <td className="px-4 py-3 text-center">
                  <div className={`inline-flex w-5 h-5 rounded border items-center justify-center ${q.required ? 'bg-brand-50 border-brand-500 text-brand-600' : 'border-slate-300'}`}>
                    {q.required && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-rose-500 transition-colors p-1" aria-label="Remove question">
                    ✕
                  </button>
                </td>
              </tr>
            ))}

            {}
            {!isAdding && (
              <tr>
                <td colSpan={5} className="px-4 py-3">
                  <button type="button" onClick={() => setIsAdding(true)} className="text-brand-600 font-semibold hover:text-brand-700 transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add a question
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {}
      {isAdding && (
        <div className="border border-brand-200 rounded-xl overflow-hidden bg-white shadow-md animate-slide-up">
          {}
          <div className="flex flex-wrap border-b border-brand-100 bg-brand-50/30">
            {WIREFRAME_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setNewQ({ ...newQ, type: t.value })}
                className={`px-4 py-3 text-sm font-semibold transition-all border-r border-brand-100 last:border-r-0 ${newQ.type === t.value ? 'bg-white text-brand-700 shadow-[inset_0_2px_0_#6650fa]' : 'text-slate-500 hover:bg-white/50 hover:text-brand-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-brand-600 mb-2 uppercase tracking-wide">Question</label>
              <input
                autoFocus
                value={newQ.label}
                onChange={e => setNewQ({ ...newQ, label: e.target.value })}
                placeholder="Anything else we should know?"
                className="w-full text-lg font-medium text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-brand-500 outline-none pb-2 transition-colors placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-brand-600 mb-2 uppercase tracking-wide">Placeholder / Example</label>
                <input
                  value={newQ.placeholder}
                  onChange={e => setNewQ({ ...newQ, placeholder: e.target.value })}
                  placeholder={WIREFRAME_TYPES.find(t => t.value === newQ.type)?.example}
                  className="input-premium !rounded-lg !text-sm !py-2"
                />
              </div>

              {needsOptions(newQ.type) && (
                <div>
                  <label className="block text-xs font-semibold text-brand-600 mb-2 uppercase tracking-wide">Options (comma separated)</label>
                  <input
                    value={newQ.options.join(', ')}
                    onChange={e => setNewQ({ ...newQ, options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Option A, Option B"
                    className="input-premium !rounded-lg !text-sm !py-2"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-700 transition-colors">Mandatory Answer</span>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newQ.required ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300 bg-white'}`}>
                  {newQ.required && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input type="checkbox" checked={newQ.required} onChange={e => setNewQ({ ...newQ, required: e.target.checked })} className="hidden" />
              </label>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-ghost !py-2 !px-4 !text-sm">Cancel</button>
                <button type="button" onClick={handleAdd} className="btn-brand !py-2 !px-5 !text-sm" disabled={!newQ.label.trim()}>Save Question</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}