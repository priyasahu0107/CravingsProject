import { Home, ClipboardList, Heart, MapPin, User, ShoppingBag } from 'lucide-react';

export const customerNavigation = [
  { path: '/customer/dashboard', label: 'Dashboard', icon: Home },
  { path: '/', label: 'Browse Restaurants', icon: ShoppingBag },
  { path: '/orders', label: 'My Orders', icon: ClipboardList },
  { path: '/favourites', label: 'Favourites', icon: Heart },
  { path: '/addresses', label: 'Addresses', icon: MapPin },
  { path: '/profile', label: 'Profile', icon: User },
];
