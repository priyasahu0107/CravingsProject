import { LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3, Settings } from 'lucide-react';

export const restaurantNavigation = [
  { path: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/restaurant/orders', label: 'Orders', icon: ClipboardList },
  { path: '/restaurant/menu', label: 'Menu', icon: UtensilsCrossed },
  { path: '/restaurant/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/restaurant/settings', label: 'Settings', icon: Settings },
];
