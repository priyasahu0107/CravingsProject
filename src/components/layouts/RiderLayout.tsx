import React from 'react';
import { LayoutDashboard, Bike, Wallet, User } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function RiderLayout() {
  const navItems = [
    { path: '/rider/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/rider/deliveries', label: 'Deliveries', icon: <Bike size={18} /> },
    { path: '/rider/earnings', label: 'Earnings', icon: <Wallet size={18} /> },
    { path: '/rider/profile', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <SidebarLayout
      title="Rider"
      subtitle="Delivery Partner"
      icon={<Bike size={20} className="text-purple-500" />}
      navItems={navItems}
      accentColor="bg-purple-500"
      bgColor="bg-gradient-to-b from-purple-600 to-purple-700"
    />
  );
}
