import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarLayoutProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  navItems: NavItem[];
  accentColor: string;
  bgColor: string;
}

export default function SidebarLayout({ title, subtitle, icon, navItems, accentColor, bgColor }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex lg:flex-col lg:w-64 ${bgColor} text-white fixed h-full`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold">Cravings</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accentColor}`}>
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-white/60 capitalize">{title}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? `${accentColor} text-white`
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className={`relative flex flex-col w-64 ${bgColor} text-white h-full`}>
            {/* Close Button */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <span className="font-bold">{title}</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accentColor}`}>
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/60 capitalize">{title}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? `${accentColor} text-white`
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => { logout(); setSidebarOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-bold text-gray-800">{title}</span>
            </div>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100">
              <LogOut size={18} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
