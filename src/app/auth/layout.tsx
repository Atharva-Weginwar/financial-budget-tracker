export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Budget Tracker</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your finances with ease</p>
        </div>
        {children}
      </div>
    </div>
  );
} 