import React from 'react';
import { Home, ShoppingBag, Heart, MapPin, User, ClipboardList } from 'lucide-react';
import SidebarLayout from './SidebarLayout';

export default function CustomerLayout() {
  const navItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { path: '/', label: 'Browse Restaurants', icon: <Home size={18} /> },
    { path: '/orders', label: 'My Orders', icon: <ClipboardList size={18} /> },
    { path: '/favourites', label: 'Favourites', icon: <Heart size={18} /> },
    { path: '/addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <SidebarLayout
      title="Customer"
      subtitle="Order food online"
      icon={<ShoppingBag size={20} className="text-orange-500" />}
      navItems={navItems}
      accentColor="bg-orange-500"
      bgColor="bg-gradient-to-b from-orange-600 to-orange-700"
    />
  );
}
