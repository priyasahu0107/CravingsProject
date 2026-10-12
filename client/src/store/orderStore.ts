import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'placed' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  getOrder: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const id = Date.now().toString();
        const orderNumber = `CRV${Date.now()}`;
        const createdAt = new Date().toISOString();

        const newOrder: Order = {
          ...orderData,
          id,
          orderNumber,
          createdAt,
        };

        set(state => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      getOrder: (id) => get().orders.find(order => order.id === id),

      getOrdersByStatus: (status) => get().orders.filter(order => order.status === status),

      updateOrderStatus: (id, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === id ? { ...order, status } : order
          ),
        }));
      },

      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'cravings-orders' }
  )
);
