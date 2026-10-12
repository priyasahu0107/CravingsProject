import { LayoutDashboard, Users, Store, Bike, ClipboardList, BarChart3 } from 'lucide-react';

export const adminNavigation = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { path: '/admin/riders', label: 'Riders', icon: Bike },
  { path: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];
