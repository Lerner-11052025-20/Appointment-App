import { useState } from 'react';
import { generateShareLink } from '../../services/appointmentService';
import Button from '../common/Button';

export default function ShareLinkModal({ appointment, onClose }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateShareLink(appointment._id);
      setUrl(res.data.shareUrl);
    } catch { setUrl('Error generating link'); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card-strong p-7 w-full max-w-md relative z-10 animate-slide-up">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Share Appointment Link</h2>
        <p className="text-sm text-slate-500 mb-5">Private links work even for unpublished appointments.</p>

        {!url ? (
          <Button onClick={handleGenerate} loading={loading}>Generate Private Link</Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-surface-100 rounded-xl border border-surface-200">
              <input readOnly value={url} className="flex-1 bg-transparent text-sm text-slate-700 outline-none truncate font-mono" />
              <button onClick={handleCopy} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'}`}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        <button onClick={onClose} className="mt-4 w-full btn-ghost !text-sm">Close</button>
      </div>
    </div>
  );
}