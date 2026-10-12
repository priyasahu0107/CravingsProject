import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config/index.js';
import { User, Restaurant, FoodCategory, FoodItem, Coupon, Address } from './models/index.js';

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data (development only)
    if (config.nodeEnv === 'development') {
      await Promise.all([
        User.deleteMany({}),
        Restaurant.deleteMany({}),
        FoodCategory.deleteMany({}),
        FoodItem.deleteMany({}),
        Coupon.deleteMany({}),
        Address.deleteMany({}),
      ]);
      console.log('🗑️  Cleared existing data');
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cravings.app',
      phone: '+91 99999 00000',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      isActive: true,
      status: 'approved',
    });
    console.log('✅ Admin created: admin@cravings.app / admin123');

    // Create demo customer
    const customer = await User.create({
      name: 'Demo Customer',
      email: 'demo@cravings.app',
      phone: '+91 98765 43210',
      password: 'demo123',
      role: 'customer',
      isVerified: true,
      isActive: true,
      status: 'approved',
    });
    console.log('✅ Customer created: demo@cravings.app / demo123');

    // Create customer address
    await Address.create({
      userId: customer._id,
      label: 'Home',
      name: 'Demo Customer',
      phone: '+91 98765 43210',
      houseNumber: '123',
      street: 'MG Road',
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    });

    // Create restaurant owner
    const restaurantOwner = await User.create({
      name: 'Restaurant Owner',
      email: 'restaurant@cravings.app',
      phone: '+91 98765 11111',
      password: 'rest123',
      role: 'restaurant',
      isVerified: true,
      isActive: true,
      status: 'approved',
    });
    console.log('✅ Restaurant owner created: restaurant@cravings.app / rest123');

    // Create restaurant
    const restaurant = await Restaurant.create({
      ownerId: restaurantOwner._id,
      name: 'The Spice Route',
      description: 'Authentic North Indian flavors with a modern twist.',
      phone: '+91 98765 11111',
      email: 'spiceroute@cravings.app',
      address: '123 MG Road, Koramangala, Bangalore',
      location: { latitude: 12.9352, longitude: 77.6245 },
      cuisine: ['Indian', 'North Indian', 'Mughlai'],
      deliveryRadius: 5,
      minimumOrder: 149,
      deliveryFee: 29,
      rating: 4.5,
      status: 'approved',
      isOpen: true,
    });
    console.log('✅ Restaurant created: The Spice Route');

    // Create food categories
    const mainCourse = await FoodCategory.create({
      restaurantId: restaurant._id,
      name: 'Main Course',
      displayOrder: 1,
      isActive: true,
    });

    const biryani = await FoodCategory.create({
      restaurantId: restaurant._id,
      name: 'Biryani',
      displayOrder: 2,
      isActive: true,
    });

    const breads = await FoodCategory.create({
      restaurantId: restaurant._id,
      name: 'Breads',
      displayOrder: 3,
      isActive: true,
    });

    const desserts = await FoodCategory.create({
      restaurantId: restaurant._id,
      name: 'Desserts',
      displayOrder: 4,
      isActive: true,
    });

    // Create food items
    const foodItems = [
      { restaurantId: restaurant._id, categoryId: mainCourse._id, name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken pieces', basePrice: 349, foodType: 'non_veg', isFeatured: true, isAvailable: true },
      { restaurantId: restaurant._id, categoryId: mainCourse._id, name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in rich spiced gravy', basePrice: 299, foodType: 'veg', isAvailable: true },
      { restaurantId: restaurant._id, categoryId: mainCourse._id, name: 'Dal Makhani', description: 'Slow-cooked black lentils in creamy butter sauce', basePrice: 249, foodType: 'veg', isAvailable: true },
      { restaurantId: restaurant._id, categoryId: biryani._id, name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken', basePrice: 329, foodType: 'non_veg', isFeatured: true, isAvailable: true },
      { restaurantId: restaurant._id, categoryId: breads._id, name: 'Garlic Naan', description: 'Freshly baked naan bread with garlic butter', basePrice: 59, foodType: 'veg', isAvailable: true },
      { restaurantId: restaurant._id, categoryId: desserts._id, name: 'Gulab Jamun', description: 'Soft milk dumplings in rose-flavored sugar syrup', basePrice: 129, foodType: 'veg', isAvailable: true },
    ];

    await FoodItem.insertMany(foodItems);
    console.log(`✅ ${foodItems.length} food items created`);

    // Create coupons
    await Coupon.create([
      {
        code: 'WELCOME50',
        description: '50% off on first order',
        discountType: 'percentage',
        discountValue: 50,
        minimumOrder: 199,
        maximumDiscount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: 'CRAVINGS100',
        description: 'Flat ₹100 off',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrder: 299,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isActive: true,
      },
    ]);
    console.log('✅ Coupons created');

    // Create rider
    const rider = await User.create({
      name: 'Demo Rider',
      email: 'rider@cravings.app',
      phone: '+91 98765 22222',
      password: 'rider123',
      role: 'rider',
      isVerified: true,
      isActive: true,
      status: 'approved',
    });
    console.log('✅ Rider created: rider@cravings.app / rider123');

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📋 Demo Credentials:');
    console.log('   Admin:      admin@cravings.app / admin123');
    console.log('   Customer:   demo@cravings.app / demo123');
    console.log('   Restaurant: restaurant@cravings.app / rest123');
    console.log('   Rider:      rider@cravings.app / rider123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
