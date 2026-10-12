import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('🗑️  Existing data cleared');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cravings.app',
      phone: '+91 99999 00000',
      password: 'admin123',
      role: 'admin',
      status: 'approved',
    });
    console.log('✅ Admin created: admin@cravings.app / admin123');

    // Create customer user
    const customer = await User.create({
      name: 'Demo Customer',
      email: 'demo@cravings.app',
      phone: '+91 98765 43210',
      password: 'demo123',
      role: 'customer',
      status: 'approved',
    });
    console.log('✅ Customer created: demo@cravings.app / demo123');

    // Create restaurant owner
    const restaurantOwner = await User.create({
      name: 'Restaurant Owner',
      email: 'restaurant@cravings.app',
      phone: '+91 98765 11111',
      password: 'restaurant123',
      role: 'restaurant',
      status: 'approved',
    });

    // Create restaurant
    const restaurant = await Restaurant.create({
      ownerId: restaurantOwner._id,
      name: 'The Spice Route',
      description: 'Authentic North Indian flavors with a modern twist. Our chefs bring decades of experience in crafting the perfect biryani and curries.',
      phone: '+91 98765 11111',
      email: 'spiceroute@cravings.app',
      address: '123 MG Road, Bangalore',
      cuisine: ['Indian', 'North Indian', 'Mughlai'],
      deliveryRadius: 5,
      minimumOrder: 149,
      deliveryFee: 29,
      rating: 4.5,
      totalReviews: 2340,
      status: 'approved',
      isOpen: true,
    });

    // Update owner with restaurant ID
    restaurantOwner.restaurantId = restaurant._id;
    await restaurantOwner.save();
    console.log('✅ Restaurant created: The Spice Route');

    // Create food items
    const foodItems = [
      {
        restaurantId: restaurant._id,
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken pieces, served with naan',
        price: 349,
        category: 'Main Course',
        foodType: 'non_veg',
        rating: 4.7,
        preparationTime: '20 min',
        isAvailable: true,
        isFeatured: true,
      },
      {
        restaurantId: restaurant._id,
        name: 'Paneer Tikka Masala',
        description: 'Grilled cottage cheese in rich spiced gravy',
        price: 299,
        category: 'Main Course',
        foodType: 'veg',
        rating: 4.5,
        preparationTime: '18 min',
        isAvailable: true,
      },
      {
        restaurantId: restaurant._id,
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice layered with spiced chicken and saffron',
        price: 329,
        category: 'Biryani',
        foodType: 'non_veg',
        rating: 4.8,
        preparationTime: '25 min',
        isAvailable: true,
        isFeatured: true,
      },
      {
        restaurantId: restaurant._id,
        name: 'Dal Makhani',
        description: 'Slow-cooked black lentils in creamy butter sauce',
        price: 249,
        category: 'Main Course',
        foodType: 'veg',
        rating: 4.4,
        preparationTime: '15 min',
        isAvailable: true,
      },
      {
        restaurantId: restaurant._id,
        name: 'Garlic Naan',
        description: 'Freshly baked naan bread with garlic butter',
        price: 59,
        category: 'Breads',
        foodType: 'veg',
        rating: 4.3,
        preparationTime: '8 min',
        isAvailable: true,
      },
      {
        restaurantId: restaurant._id,
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
        price: 129,
        category: 'Desserts',
        foodType: 'veg',
        rating: 4.6,
        preparationTime: '5 min',
        isAvailable: true,
      },
    ];

    await FoodItem.insertMany(foodItems);
    console.log(`✅ ${foodItems.length} food items created`);

    // Create rider user
    const rider = await User.create({
      name: 'Demo Rider',
      email: 'rider@cravings.app',
      phone: '+91 98765 22222',
      password: 'rider123',
      role: 'rider',
      status: 'approved',
      riderProfile: {
        vehicleType: 'Bike',
        vehicleNumber: 'KA01AB1234',
        licenseNumber: 'DL1420210012345',
        isOnline: true,
        totalDeliveries: 156,
        rating: 4.8,
        earnings: 12500,
      },
    });
    console.log('✅ Rider created: rider@cravings.app / rider123');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin:      admin@cravings.app / admin123');
    console.log('   Customer:   demo@cravings.app / demo123');
    console.log('   Restaurant: restaurant@cravings.app / restaurant123');
    console.log('   Rider:      rider@cravings.app / rider123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
