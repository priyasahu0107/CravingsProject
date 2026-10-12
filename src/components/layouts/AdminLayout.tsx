import React from 'react';
import { LayoutDashboard, Users, Store, Bike, ClipboardList, BarChart3 } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function AdminLayout() {
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { path: '/admin/restaurants', label: 'Restaurants', icon: <Store size={18} /> },
    { path: '/admin/riders', label: 'Riders', icon: <Bike size={18} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ClipboardList size={18} /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];

  return (
    <SidebarLayout
      title="Admin"
      subtitle="Platform Management"
      icon={<LayoutDashboard size={20} className="text-red-500" />}
      navItems={navItems}
      accentColor="bg-red-500"
      bgColor="bg-gradient-to-b from-red-600 to-red-700"
    />
  );
}
