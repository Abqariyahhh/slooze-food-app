import { PrismaClient, Role, Country, PaymentType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@slooze.com' },
    update: {},
    create: {
      email: 'admin@slooze.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      country: Country.INDIA,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@slooze.com' },
    update: {},
    create: {
      email: 'manager@slooze.com',
      password: await bcrypt.hash('manager123', 10),
      firstName: 'Manager',
      lastName: 'User',
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  })

  const member = await prisma.user.upsert({
    where: { email: 'member@slooze.com' },
    update: {},
    create: {
      email: 'member@slooze.com',
      password: await bcrypt.hash('member123', 10),
      firstName: 'Member',
      lastName: 'User',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  })

  // Seed Indian Restaurants
  const spiceGarden = await prisma.restaurant.upsert({
    where: { id: 'rest-india-1' },
    update: {},
    create: {
      id: 'rest-india-1',
      name: 'Spice Garden',
      description: 'Authentic North Indian cuisine',
      country: Country.INDIA,
      address: 'Connaught Place, New Delhi',
      rating: 4.5,
    },
  })

  const biryaniHouse = await prisma.restaurant.upsert({
    where: { id: 'rest-india-2' },
    update: {},
    create: {
      id: 'rest-india-2',
      name: 'Biryani House',
      description: 'Hyderabadi dum biryani specialists',
      country: Country.INDIA,
      address: 'Banjara Hills, Hyderabad',
      rating: 4.7,
    },
  })

  // Seed American Restaurants
  const burgerBarn = await prisma.restaurant.upsert({
    where: { id: 'rest-america-1' },
    update: {},
    create: {
      id: 'rest-america-1',
      name: 'Burger Barn',
      description: 'Classic American burgers and fries',
      country: Country.AMERICA,
      address: '5th Avenue, New York',
      rating: 4.3,
    },
  })

  const pizzaPalace = await prisma.restaurant.upsert({
    where: { id: 'rest-america-2' },
    update: {},
    create: {
      id: 'rest-america-2',
      name: 'Pizza Palace',
      description: 'New York style hand-tossed pizza',
      country: Country.AMERICA,
      address: 'Hollywood Blvd, Los Angeles',
      rating: 4.6,
    },
  })

  // Seed Menu Items
  await prisma.menuItem.createMany({
    skipDuplicates: true,
    data: [
      // Spice Garden
      { id: 'menu-1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 320, restaurantId: 'rest-india-1' },
      { id: 'menu-2', name: 'Dal Makhani', description: 'Slow-cooked black lentils', price: 280, restaurantId: 'rest-india-1' },
      { id: 'menu-3', name: 'Butter Naan', description: 'Soft tandoor bread with butter', price: 60, restaurantId: 'rest-india-1' },
      { id: 'menu-4', name: 'Mango Lassi', description: 'Sweet yogurt mango drink', price: 120, restaurantId: 'rest-india-1' },
      // Biryani House
      { id: 'menu-5', name: 'Chicken Dum Biryani', description: 'Slow-cooked aromatic rice with chicken', price: 420, restaurantId: 'rest-india-2' },
      { id: 'menu-6', name: 'Mutton Biryani', description: 'Rich mutton dum biryani', price: 520, restaurantId: 'rest-india-2' },
      { id: 'menu-7', name: 'Raita', description: 'Cooling yogurt side dish', price: 80, restaurantId: 'rest-india-2' },
      // Burger Barn
      { id: 'menu-8', name: 'Classic Cheeseburger', description: 'Beef patty with cheddar', price: 14.99, restaurantId: 'rest-america-1' },
      { id: 'menu-9', name: 'BBQ Bacon Burger', description: 'Smoky BBQ with crispy bacon', price: 17.99, restaurantId: 'rest-america-1' },
      { id: 'menu-10', name: 'Loaded Fries', description: 'Fries with cheese and jalapeños', price: 8.99, restaurantId: 'rest-america-1' },
      // Pizza Palace
      { id: 'menu-11', name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 18.99, restaurantId: 'rest-america-2' },
      { id: 'menu-12', name: 'Pepperoni Pizza', description: 'Classic NY pepperoni', price: 21.99, restaurantId: 'rest-america-2' },
      { id: 'menu-13', name: 'Garlic Bread', description: 'Toasted with herb butter', price: 6.99, restaurantId: 'rest-america-2' },
    ],
  })

  // Seed Payment Methods for Admin
  await prisma.paymentMethod.createMany({
    skipDuplicates: true,
    data: [
      { id: 'pay-1', userId: admin.id, type: PaymentType.CARD, last4: '4242', nickname: 'Visa Card', isDefault: true },
      { id: 'pay-2', userId: admin.id, type: PaymentType.UPI, last4: '9876', nickname: 'Google Pay' },
    ],
  })

  console.log('✅ Seed complete!')
  console.log(`👤 Admin: admin@slooze.com / admin123`)
  console.log(`👤 Manager: manager@slooze.com / manager123`)
  console.log(`👤 Member: member@slooze.com / member123`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
