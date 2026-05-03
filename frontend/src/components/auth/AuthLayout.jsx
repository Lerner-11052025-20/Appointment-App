export default function AuthLayout({ children, visualPanel }) {
  return (
    <div className="relative min-h-screen flex bg-slate-50 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-300/30 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-200/25 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-indigo-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-amber-100/15 rounded-full blur-[80px]" />
      </div>

      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] relative z-10 flex-col justify-between p-10 xl:p-14">
        {visualPanel}
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[460px]" style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>{children}</div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}