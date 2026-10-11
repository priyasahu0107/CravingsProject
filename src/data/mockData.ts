export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  foodType: 'veg' | 'non_veg' | 'egg';
  category: string;
  rating: number;
  prepTime: string;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  totalReviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  priceRange: string;
  isOpen: boolean;
  address: string;
  description: string;
  menu: FoodItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { id: '2', name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { id: '3', name: 'Biryani', icon: '🍛', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
  { id: '4', name: 'Chinese', icon: '🥡', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop' },
  { id: '5', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop' },
  { id: '6', name: 'Healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
  { id: '7', name: 'South Indian', icon: '🫓', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop' },
  { id: '8', name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Spice Route',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
    cuisine: ['Indian', 'North Indian', 'Mughlai'],
    rating: 4.5,
    totalReviews: 2340,
    deliveryTime: '25-35 min',
    deliveryFee: 29,
    minimumOrder: 149,
    priceRange: '₹₹',
    isOpen: true,
    address: '123 MG Road, Bangalore',
    description: 'Authentic North Indian flavors with a modern twist. Our chefs bring decades of experience in crafting the perfect biryani and curries.',
    menu: [
      { id: '101', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken pieces, served with naan', price: 349, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Main Course', rating: 4.7, prepTime: '20 min', isAvailable: true, isFeatured: true },
      { id: '102', name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in rich spiced gravy', price: 299, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', foodType: 'veg', category: 'Main Course', rating: 4.5, prepTime: '18 min', isAvailable: true },
      { id: '103', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and saffron', price: 329, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Biryani', rating: 4.8, prepTime: '25 min', isAvailable: true, isFeatured: true },
      { id: '104', name: 'Dal Makhani', description: 'Slow-cooked black lentils in creamy butter sauce', price: 249, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', foodType: 'veg', category: 'Main Course', rating: 4.4, prepTime: '15 min', isAvailable: true },
      { id: '105', name: 'Garlic Naan', description: 'Freshly baked naan bread with garlic butter', price: 59, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', foodType: 'veg', category: 'Breads', rating: 4.3, prepTime: '8 min', isAvailable: true },
      { id: '106', name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose-flavored sugar syrup', price: 129, image: 'https://images.unsplash.com/photo-1666190050397-0ba06da36b34?w=400&h=300&fit=crop', foodType: 'veg', category: 'Desserts', rating: 4.6, prepTime: '5 min', isAvailable: true },
    ]
  },
  {
    id: '2',
    name: 'Burger Barn',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&h=400&fit=crop',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    rating: 4.3,
    totalReviews: 1856,
    deliveryTime: '15-25 min',
    deliveryFee: 19,
    minimumOrder: 99,
    priceRange: '₹₹',
    isOpen: true,
    address: '456 Brigade Road, Bangalore',
    description: 'Handcrafted burgers made with premium ingredients. Every bite is a burst of flavor.',
    menu: [
      { id: '201', name: 'Classic Smash Burger', description: 'Double smashed patties with American cheese, pickles, and special sauce', price: 279, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Burgers', rating: 4.6, prepTime: '12 min', isAvailable: true, isFeatured: true },
      { id: '202', name: 'Crispy Chicken Burger', description: 'Buttermilk fried chicken with coleslaw and chipotle mayo', price: 299, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Burgers', rating: 4.4, prepTime: '15 min', isAvailable: true },
      { id: '203', name: 'Veggie Supreme', description: 'Plant-based patty with avocado, lettuce, tomato, and vegan cheese', price: 249, image: 'https://images.unsplash.com/photo-1520072959219-c595e6cdc07e?w=400&h=300&fit=crop', foodType: 'veg', category: 'Burgers', rating: 4.2, prepTime: '12 min', isAvailable: true },
      { id: '204', name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, jalapeños, and bacon bits', price: 179, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Sides', rating: 4.5, prepTime: '10 min', isAvailable: true },
      { id: '205', name: 'Chocolate Milkshake', description: 'Thick and creamy chocolate milkshake with whipped cream', price: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', foodType: 'veg', category: 'Beverages', rating: 4.7, prepTime: '5 min', isAvailable: true },
    ]
  },
  {
    id: '3',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.6,
    totalReviews: 3120,
    deliveryTime: '20-30 min',
    deliveryFee: 39,
    minimumOrder: 199,
    priceRange: '₹₹₹',
    isOpen: true,
    address: '789 Koramangala, Bangalore',
    description: 'Authentic Italian pizzas baked in wood-fired ovens. Fresh ingredients, unforgettable taste.',
    menu: [
      { id: '301', name: 'Margherita', description: 'Classic tomato sauce, fresh mozzarella, basil leaves', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', foodType: 'veg', category: 'Pizzas', rating: 4.5, prepTime: '15 min', isAvailable: true, isFeatured: true },
      { id: '302', name: 'Pepperoni Supreme', description: 'Loaded with pepperoni, mozzarella, and Italian herbs', price: 449, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Pizzas', rating: 4.8, prepTime: '18 min', isAvailable: true, isFeatured: true },
      { id: '303', name: 'BBQ Chicken', description: 'Smoky BBQ sauce, grilled chicken, red onions, cilantro', price: 429, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Pizzas', rating: 4.6, prepTime: '18 min', isAvailable: true },
      { id: '304', name: 'Penne Arrabbiata', description: 'Spicy tomato sauce pasta with garlic and chili flakes', price: 279, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop', foodType: 'veg', category: 'Pasta', rating: 4.3, prepTime: '15 min', isAvailable: true },
      { id: '305', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 129, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop', foodType: 'veg', category: 'Sides', rating: 4.4, prepTime: '8 min', isAvailable: true },
      { id: '306', name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers', price: 199, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', foodType: 'veg', category: 'Desserts', rating: 4.7, prepTime: '5 min', isAvailable: true },
    ]
  },
  {
    id: '4',
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&h=400&fit=crop',
    cuisine: ['Chinese', 'Asian', 'Thai'],
    rating: 4.2,
    totalReviews: 1567,
    deliveryTime: '20-30 min',
    deliveryFee: 25,
    minimumOrder: 129,
    priceRange: '₹₹',
    isOpen: true,
    address: '321 Indiranagar, Bangalore',
    description: 'Authentic Asian flavors from wok to your doorstep. Stir-fried to perfection.',
    menu: [
      { id: '401', name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and soy sauce', price: 199, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', foodType: 'veg', category: 'Noodles', rating: 4.3, prepTime: '12 min', isAvailable: true },
      { id: '402', name: 'Chicken Manchurian', description: 'Crispy chicken in tangy Manchurian sauce', price: 279, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Starters', rating: 4.5, prepTime: '15 min', isAvailable: true, isFeatured: true },
      { id: '403', name: 'Fried Rice', description: 'Wok-tossed rice with vegetables and eggs', price: 189, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', foodType: 'egg', category: 'Rice', rating: 4.2, prepTime: '12 min', isAvailable: true },
      { id: '404', name: 'Spring Rolls', description: 'Crispy rolls filled with vegetables, served with sweet chili sauce', price: 159, image: 'https://images.unsplash.com/photo-1548507200-e49e15f5b2a2?w=400&h=300&fit=crop', foodType: 'veg', category: 'Starters', rating: 4.4, prepTime: '10 min', isAvailable: true },
      { id: '405', name: 'Kung Pao Chicken', description: 'Spicy diced chicken with peanuts and dried chilies', price: 299, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Main Course', rating: 4.6, prepTime: '15 min', isAvailable: true },
    ]
  },
  {
    id: '5',
    name: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=400&fit=crop',
    cuisine: ['Healthy', 'Salads', 'Bowls'],
    rating: 4.7,
    totalReviews: 980,
    deliveryTime: '15-25 min',
    deliveryFee: 35,
    minimumOrder: 199,
    priceRange: '₹₹₹',
    isOpen: true,
    address: '567 HSR Layout, Bangalore',
    description: 'Fresh, nutritious meals for the health-conscious. Farm-to-bowl goodness.',
    menu: [
      { id: '501', name: 'Quinoa Power Bowl', description: 'Quinoa, avocado, chickpeas, kale, and tahini dressing', price: 349, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', foodType: 'veg', category: 'Bowls', rating: 4.8, prepTime: '10 min', isAvailable: true, isFeatured: true },
      { id: '502', name: 'Grilled Chicken Salad', description: 'Mixed greens, grilled chicken, cherry tomatoes, feta cheese', price: 329, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', foodType: 'non_veg', category: 'Salads', rating: 4.6, prepTime: '12 min', isAvailable: true },
      { id: '503', name: 'Acai Bowl', description: 'Frozen acai blended with banana, topped with granola and berries', price: 279, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', foodType: 'veg', category: 'Bowls', rating: 4.7, prepTime: '8 min', isAvailable: true },
      { id: '504', name: 'Protein Smoothie', description: 'Whey protein, banana, peanut butter, and almond milk', price: 199, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop', foodType: 'veg', category: 'Beverages', rating: 4.5, prepTime: '5 min', isAvailable: true },
    ]
  },
  {
    id: '6',
    name: 'Dosa Factory',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=1200&h=400&fit=crop',
    cuisine: ['South Indian', 'Dosa', 'Idli'],
    rating: 4.4,
    totalReviews: 2100,
    deliveryTime: '20-30 min',
    deliveryFee: 15,
    minimumOrder: 99,
    priceRange: '₹',
    isOpen: true,
    address: '890 Jayanagar, Bangalore',
    description: 'Traditional South Indian breakfast and meals. Crispy dosas and fluffy idlis made fresh.',
    menu: [
      { id: '601', name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato filling', price: 129, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop', foodType: 'veg', category: 'Dosa', rating: 4.6, prepTime: '12 min', isAvailable: true, isFeatured: true },
      { id: '602', name: 'Idli Sambar', description: 'Steamed rice cakes served with lentil soup and chutneys', price: 89, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', foodType: 'veg', category: 'Idli', rating: 4.4, prepTime: '10 min', isAvailable: true },
      { id: '603', name: 'Rava Dosa', description: 'Crispy semolina crepe with onions and green chilies', price: 119, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop', foodType: 'veg', category: 'Dosa', rating: 4.3, prepTime: '12 min', isAvailable: true },
      { id: '604', name: 'Filter Coffee', description: 'Traditional South Indian filter coffee', price: 49, image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&h=300&fit=crop', foodType: 'veg', category: 'Beverages', rating: 4.8, prepTime: '5 min', isAvailable: true },
      { id: '605', name: 'Vada', description: 'Crispy lentil fritters served with sambar and chutney', price: 69, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop', foodType: 'veg', category: 'Snacks', rating: 4.5, prepTime: '8 min', isAvailable: true },
    ]
  },
];

export const banners = [
  { id: '1', title: '50% OFF', subtitle: 'On your first order', code: 'WELCOME50', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop' },
  { id: '2', title: 'Free Delivery', subtitle: 'On orders above ₹299', code: 'FREEDEL', image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=400&fit=crop' },
  { id: '3', title: 'Flat ₹100 OFF', subtitle: 'Use code CRAVINGS100', code: 'CRAVINGS100', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop' },
];

export interface OrderStatus {
  status: string;
  timestamp: string;
  completed: boolean;
}

export const mockOrderStatuses: OrderStatus[] = [
  { status: 'Order Placed', timestamp: '2:30 PM', completed: true },
  { status: 'Restaurant Accepted', timestamp: '2:32 PM', completed: true },
  { status: 'Preparing', timestamp: '2:35 PM', completed: true },
  { status: 'Ready for Pickup', timestamp: '2:50 PM', completed: true },
  { status: 'Rider Assigned', timestamp: '2:52 PM', completed: true },
  { status: 'Picked Up', timestamp: '3:00 PM', completed: false },
  { status: 'Out for Delivery', timestamp: '', completed: false },
  { status: 'Delivered', timestamp: '', completed: false },
];
