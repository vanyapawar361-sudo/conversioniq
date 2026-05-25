import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { Organization } from '../models/Organization';
import { Project } from '../models/Project';
import { Session } from '../models/Session';
import { Event } from '../models/Event';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/conversioniq';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Organization.deleteMany({});
    await Project.deleteMany({});
    await Session.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create Organization
    const org = await Organization.create({
      name: 'EcoStore Demo',
      plan: 'Pro'
    });

    // Create Admin User
    const hashedPassword = await bcrypt.hash('password123', 12);
    await User.create({
      organizationId: org._id,
      email: 'admin@ecostore.com',
      passwordHash: hashedPassword,
      role: 'Admin'
    });

    // Create Project
    const project = await Project.create({
      organizationId: org._id,
      name: 'Main Storefront',
      domain: 'ecostore.com',
      trackingId: 'demo-tracking-id-123'
    });

    console.log('Created Org, User, and Project');

    const sessionsCount = 200;
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
    const oss = ['macOS', 'Windows', 'iOS', 'Android'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'India'];
    const referrers = ['google.com', 'facebook.com', 'instagram.com', 'direct', 'twitter.com'];

    const eventTypes = [
      'page_view', // 100%
      'click',      // product view - 70%
      'add_to_cart', // 20%
      'checkout_started', // 10%
      'purchase_completed' // 4%
    ];

    for (let i = 0; i < sessionsCount; i++) {
      const device = faker.helpers.arrayElement(devices);
      const session = await Session.create({
        projectId: project._id,
        visitorId: faker.string.uuid(),
        browser: faker.helpers.arrayElement(browsers),
        os: faker.helpers.arrayElement(oss),
        device: device,
        country: faker.helpers.arrayElement(countries),
        referrer: faker.helpers.arrayElement(referrers),
        landingPage: '/',
        startTime: faker.date.recent({ days: 7 }),
        duration: faker.number.int({ min: 30, max: 600 }),
        frustrationScore: faker.number.int({ min: 0, max: 100 })
      });

      // Generate Events for this session
      const events = [];
      
      // Always a page view
      events.push({
        projectId: project._id,
        sessionId: session._id,
        type: 'page_view',
        url: '/',
        timestamp: session.startTime
      });

      // 70% chance to view a product
      if (Math.random() < 0.7) {
        const productT = new Date(session.startTime.getTime() + 5000);
        events.push({
          projectId: project._id,
          sessionId: session._id,
          type: 'click',
          url: '/products/premium-headphones',
          targetSelector: '.product-card',
          targetText: 'Premium Headphones',
          timestamp: productT
        });

        // 30% chance of rage click if on mobile/slow
        if (device === 'Mobile' && Math.random() < 0.3) {
           events.push({
            projectId: project._id,
            sessionId: session._id,
            type: 'rage_click',
            url: '/products/premium-headphones',
            timestamp: new Date(productT.getTime() + 1000)
          });
        }

        // 25% chance to add to cart
        if (Math.random() < 0.25) {
          const cartT = new Date(productT.getTime() + 15000);
          events.push({
            projectId: project._id,
            sessionId: session._id,
            type: 'add_to_cart',
            url: '/products/premium-headphones',
            timestamp: cartT
          });

          // 50% chance to start checkout
          if (Math.random() < 0.5) {
            const checkoutT = new Date(cartT.getTime() + 30000);
            events.push({
              projectId: project._id,
              sessionId: session._id,
              type: 'checkout_started',
              url: '/checkout',
              timestamp: checkoutT
            });

            // 40% chance to complete purchase
            if (Math.random() < 0.4) {
              events.push({
                projectId: project._id,
                sessionId: session._id,
                type: 'purchase_completed',
                url: '/thank-you',
                timestamp: new Date(checkoutT.getTime() + 60000),
                metadata: { amount: 199.99, currency: 'USD' }
              });
            }
          }
        }
      }

      await Event.insertMany(events);
      if (i % 50 === 0) console.log(`Seeded ${i} sessions...`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
