import { LayoutDashboard, Bike, Wallet, User } from 'lucide-react';

export const riderNavigation = [
  { path: '/rider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rider/deliveries', label: 'Deliveries', icon: Bike },
  { path: '/rider/earnings', label: 'Earnings', icon: Wallet },
  { path: '/rider/profile', label: 'Profile', icon: User },
];
