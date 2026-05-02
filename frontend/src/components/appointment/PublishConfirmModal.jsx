import Button from '../common/Button';

export default function PublishConfirmModal({ isPublished, loading, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card-strong p-7 w-full max-w-sm relative z-10 animate-slide-up text-center">
        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isPublished ? 'bg-amber-50' : 'bg-emerald-50'}`}>
          {isPublished ? (
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          ) : (
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">{isPublished ? 'Unpublish this appointment?' : 'Publish this appointment?'}</h2>
        <p className="text-sm text-slate-500 mb-6">{isPublished ? 'Customers will no longer see this appointment.' : 'This appointment will be visible to customers.'}</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} loading={loading} className="flex-1">{isPublished ? 'Unpublish' : 'Publish'}</Button>
        </div>
      </div>
    </div>
  );
}