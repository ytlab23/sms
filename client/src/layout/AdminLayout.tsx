import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin382013453sms"
                className="text-white hover:bg-gray-700 rounded px-3 py-2 block"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin382013453sms/settings"
                className="text-white hover:bg-gray-700 rounded px-3 py-2 block"
              >
                Settings
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 p-4 shadow-md">
          <h2 className="text-xl font-semibold">Welcome to the Admin Dashboard</h2>
          {/* Add other header elements like logout button or notifications */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50"><p>Admin Layout</p>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;