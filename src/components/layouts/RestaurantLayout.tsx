import React from 'react';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3, Settings } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function RestaurantLayout() {
  const navItems = [
    { path: '/restaurant/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/restaurant/orders', label: 'Orders', icon: <ClipboardList size={18} /> },
    { path: '/restaurant/menu', label: 'Menu', icon: <UtensilsCrossed size={18} /> },
    { path: '/restaurant/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { path: '/restaurant/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <SidebarLayout
      title="Restaurant"
      subtitle="Manage your restaurant"
      icon={<UtensilsCrossed size={20} className="text-blue-500" />}
      navItems={navItems}
      accentColor="bg-blue-500"
      bgColor="bg-gradient-to-b from-blue-600 to-blue-700"
    />
  );
}
