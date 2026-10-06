export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-label mb-2">SPV Chat</div>
          <h1 className="display-lg gradient-text">Welcome</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
