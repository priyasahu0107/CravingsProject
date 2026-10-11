export interface RestaurantOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up';
  time: string;
  paymentMethod: string;
}

export const restaurantOrders: RestaurantOrder[] = [
  {
    id: 'ro1',
    orderNumber: 'CRV20260115001',
    customerName: 'Priya Sharma',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 329 },
      { name: 'Raita', quantity: 1, price: 59 },
    ],
    total: 717,
    status: 'new',
    time: '2 min ago',
    paymentMethod: 'Online',
  },
  {
    id: 'ro2',
    orderNumber: 'CRV20260115002',
    customerName: 'Rahul Verma',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 349 },
      { name: 'Garlic Naan', quantity: 2, price: 59 },
    ],
    total: 467,
    status: 'preparing',
    time: '8 min ago',
    paymentMethod: 'COD',
  },
  {
    id: 'ro3',
    orderNumber: 'CRV20260115003',
    customerName: 'Anita Desai',
    items: [
      { name: 'Paneer Tikka Masala', quantity: 1, price: 299 },
      { name: 'Dal Makhani', quantity: 1, price: 249 },
    ],
    total: 548,
    status: 'ready',
    time: '15 min ago',
    paymentMethod: 'Online',
  },
  {
    id: 'ro4',
    orderNumber: 'CRV20260115004',
    customerName: 'Vikram Singh',
    items: [
      { name: 'Mutton Biryani', quantity: 1, price: 399 },
    ],
    total: 399,
    status: 'picked_up',
    time: '25 min ago',
    paymentMethod: 'Online',
  },
];

export const restaurantAnalytics = {
  todayOrders: 47,
  todayRevenue: 18420,
  avgPrepTime: '18 min',
  avgRating: 4.5,
  weeklyData: [
    { day: 'Mon', orders: 38, revenue: 14200 },
    { day: 'Tue', orders: 42, revenue: 16800 },
    { day: 'Wed', orders: 35, revenue: 13500 },
    { day: 'Thu', orders: 48, revenue: 19200 },
    { day: 'Fri', orders: 62, revenue: 24800 },
    { day: 'Sat', orders: 71, revenue: 28400 },
    { day: 'Sun', orders: 55, revenue: 22000 },
  ],
  topItems: [
    { name: 'Chicken Biryani', orders: 156, revenue: 51324 },
    { name: 'Butter Chicken', orders: 132, revenue: 46068 },
    { name: 'Paneer Tikka', orders: 98, revenue: 29202 },
    { name: 'Dal Makhani', orders: 87, revenue: 21663 },
  ],
};

export interface RiderDeliveryRequest {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerAddress: string;
  distance: string;
  earnings: number;
  items: number;
  estimatedTime: string;
}

export const riderRequests: RiderDeliveryRequest[] = [
  {
    id: 'rd1',
    restaurantName: 'The Spice Route',
    restaurantAddress: '123 MG Road',
    customerAddress: '456 Brigade Road, 3.2 km away',
    distance: '3.2 km',
    earnings: 45,
    items: 2,
    estimatedTime: '25 min',
  },
  {
    id: 'rd2',
    restaurantName: 'Burger Barn',
    restaurantAddress: '789 Indiranagar',
    customerAddress: '321 HSR Layout, 4.5 km away',
    distance: '4.5 km',
    earnings: 65,
    items: 3,
    estimatedTime: '30 min',
  },
];

export const riderStats = {
  todayDeliveries: 12,
  todayEarnings: 780,
  rating: 4.8,
  acceptanceRate: 92,
  weeklyEarnings: [
    { day: 'Mon', earnings: 620 },
    { day: 'Tue', earnings: 780 },
    { day: 'Wed', earnings: 540 },
    { day: 'Thu', earnings: 890 },
    { day: 'Fri', earnings: 1120 },
    { day: 'Sat', earnings: 1340 },
    { day: 'Sun', earnings: 980 },
  ],
  activeDelivery: {
    orderNumber: 'CRV20260115001',
    restaurantName: 'The Spice Route',
    customerName: 'Priya Sharma',
    customerAddress: '456 Brigade Road, Bangalore',
    status: 'picked_up',
    items: 2,
    otp: '4829',
  },
};

export const adminStats = {
  totalCustomers: 12450,
  totalRestaurants: 342,
  totalRiders: 890,
  todayOrders: 1847,
  todayRevenue: 487620,
  monthlyData: [
    { month: 'Jul', orders: 12400, revenue: 3240000 },
    { month: 'Aug', orders: 14200, revenue: 3720000 },
    { month: 'Sep', orders: 15800, revenue: 4140000 },
    { month: 'Oct', orders: 17200, revenue: 4510000 },
    { month: 'Nov', orders: 18900, revenue: 4950000 },
    { month: 'Dec', orders: 21400, revenue: 5610000 },
    { month: 'Jan', orders: 19800, revenue: 5190000 },
  ],
  recentOrders: [
    { id: 'ao1', orderNumber: 'CRV20260115001', customer: 'Priya S.', restaurant: 'The Spice Route', rider: 'Rahul K.', amount: 717, status: 'delivered' },
    { id: 'ao2', orderNumber: 'CRV20260115002', customer: 'Rahul V.', restaurant: 'Burger Barn', rider: 'Amit P.', amount: 467, status: 'out_for_delivery' },
    { id: 'ao3', orderNumber: 'CRV20260115003', customer: 'Anita D.', restaurant: 'Pizza Palace', rider: 'Unassigned', amount: 548, status: 'preparing' },
    { id: 'ao4', orderNumber: 'CRV20260115004', customer: 'Vikram S.', restaurant: 'Dragon Wok', rider: 'Suresh M.', amount: 399, status: 'delivered' },
    { id: 'ao5', orderNumber: 'CRV20260115005', customer: 'Meera K.', restaurant: 'Green Bowl', rider: 'Ravi T.', amount: 823, status: 'picked_up' },
  ],
  topRestaurants: [
    { name: 'The Spice Route', orders: 1240, revenue: 487620 },
    { name: 'Pizza Palace', orders: 1089, revenue: 521430 },
    { name: 'Burger Barn', orders: 956, revenue: 312450 },
    { name: 'Dragon Wok', orders: 823, revenue: 287650 },
    { name: 'Green Bowl', orders: 612, revenue: 245890 },
  ],
  pendingApprovals: {
    restaurants: 8,
    riders: 15,
  },
};
