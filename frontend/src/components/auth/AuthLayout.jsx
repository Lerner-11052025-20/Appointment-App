export default function AuthLayout({ children, visualPanel }) {
  return (
    <div className="relative min-h-screen flex bg-surface-50 overflow-hidden">
      {}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative z-10 flex-col justify-between p-10 xl:p-14">
        {visualPanel}
      </div>

      {}
      <div className="flex-1 relative z-10 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[440px] animate-slide-up">{children}</div>
      </div>
    </div>
  );
}