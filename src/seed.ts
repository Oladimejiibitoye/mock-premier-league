import mongoose from 'mongoose';
import { Team } from './models/team'; 
import { Fixture } from './models/fixture';
import { faker } from '@faker-js/faker';
import { MONGO_URI } from './environment/config';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI,{});
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Seed Teams
const seedTeams = async () => {
  const teams = [];
  for (let i = 0; i < 100; i++) {
    teams.push({
      name: faker.company.name(), // Generate random team name
      country: faker.location.country(), // Generate random country
    });
  }
  await Team.insertMany(teams);
  console.log('100 Teams seeded');
};

// Seed Fixtures
const seedFixtures = async () => {
  const teams = await Team.find(); // Fetch all teams
  const fixtures = [];

  for (let i = 0; i < 1000; i++) {
    // Randomly select home and away teams
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    const awayTeam = teams[Math.floor(Math.random() * teams.length)];

    const fixtureId = new mongoose.Types.ObjectId();

    // Ensure home and away teams are not the same
    if (homeTeam._id !== awayTeam._id) {
      fixtures.push({
        _id: fixtureId,
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        date: faker.date.future(), // Generate random future date
        status: faker.helpers.arrayElement(['pending', 'completed']), // Random fixture status
        location: faker.location.county(),
        uniqueLink: `fixture/${fixtureId}`
      });
    }
  }
  await Fixture.insertMany(fixtures);
  console.log('1000 Fixtures seeded');
};

// Main seeder function
const seedDatabase = async () => {
  await connectDB();
  await seedTeams();
  await seedFixtures();
  mongoose.disconnect();
};

seedDatabase().catch((err) => {
  console.error('Error seeding database:', err);
  mongoose.disconnect();
});
