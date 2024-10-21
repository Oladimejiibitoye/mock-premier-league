import request from 'supertest';
import app from '../app'; 
import { Team } from '../models/team';
import { Fixture } from '../models/fixture';
import { NextFunction, Request, Response } from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/auth';

//This test code was not completed and should not be run, Thank you
// Mocking authentication middleware
jest.mock('../src/middlewares/auth', () => ({
  authenticateToken: (req: Request, res: Response, next: NextFunction) => next(),
  authorizeAdmin: (req: Request, res: Response, next: NextFunction) => next(),
}));

// Mocking Team and Fixture models
jest.mock('../src/models/team', () => ({
  Team: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock('../src/models/fixture', () => ({
  Fixture: {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('Auth Endpoints', () => {
  describe('POST /sign-up', () => {
    it('should register a user successfully', async () => {
      const response = await request(app)
        .post('/sign-up')
        .send({ username: 'testuser', password: 'password123', email: 'test@example.com' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
  });

  describe('POST /login', () => {
    it('should login a user successfully', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});

describe('Team Endpoints', () => {
  describe('POST /teams', () => {
    it('should add a team successfully', async () => {
      // Mock the create method to simulate adding a team
      (Team.create as jest.Mock).mockResolvedValueOnce({ name: 'Team A', country: 'Country A' });

      const response = await request(app)
        .post('/teams')
        .send({ name: 'Team A', country: 'Country A' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Team added successfully');
    });

    it('should return 400 if team already exists', async () => {
      // Mock the findOne call to simulate an existing team
      (Team.findOne as jest.Mock).mockResolvedValueOnce({ name: 'Team A' });

      const response = await request(app)
        .post('/teams')
        .send({ name: 'Team A', country: 'Country A' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Team already exists');
    });
  });

  describe('PATCH /teams/:id', () => {
    it('should update a team successfully', async () => {
      // Mock the findByIdAndUpdate method
      (Team.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ name: 'Updated Team', country: 'Updated Country' });

      const response = await request(app)
        .patch('/teams/123')
        .send({ name: 'Updated Team', country: 'Updated Country' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Team updated successfully');
    });
  });

  describe('DELETE /teams/:id', () => {
    it('should delete a team successfully', async () => {
      // Mock the findByIdAndDelete method
      (Team.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({});

      const response = await request(app).delete('/teams/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Team removed successfully');
    });
  });

  describe('GET /teams/search', () => {
    it('should search teams with pagination', async () => {
      // Mock the find method to return an array of teams
      (Team.find as jest.Mock).mockResolvedValueOnce([
        { name: 'Team A', country: 'Country A' },
        { name: 'Team B', country: 'Country B' },
      ]);

      const response = await request(app).get('/teams/search?name=Team&page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('teams');
      expect(response.body.pagination).toHaveProperty('currentPage', 1);
    });
  });

  describe('GET /teams/:id', () => {
    it('should fetch a team by id', async () => {
      // Mock the findById method to return a specific team
      (Team.findById as jest.Mock).mockResolvedValueOnce({ name: 'Team A', country: 'Country A' });

      const response = await request(app).get('/teams/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});

describe('Fixture Endpoints', () => {
  describe('POST /fixtures', () => {
    it('should add a fixture successfully', async () => {
      // Mock the create method to simulate adding a fixture
      (Fixture.create as jest.Mock).mockResolvedValueOnce({
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        date: '2024-10-18',
      });

      const response = await request(app)
        .post('/fixtures')
        .send({ homeTeam: 'Team A', awayTeam: 'Team B', date: '2024-10-18' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Fixture created successfully');
    });
  });

  describe('PATCH /fixtures/:id', () => {
    it('should update a fixture successfully', async () => {
      // Mock the findByIdAndUpdate method
      (Fixture.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        homeTeam: 'Updated Team A',
        awayTeam: 'Updated Team B',
        date: '2024-10-19',
      });

      const response = await request(app)
        .patch('/fixtures/123')
        .send({ homeTeam: 'Updated Team A', awayTeam: 'Updated Team B', date: '2024-10-19' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Fixture updated successfully');
    });
  });

  describe('DELETE /fixtures/:id', () => {
    it('should delete a fixture successfully', async () => {
      // Mock the findByIdAndDelete method
      (Fixture.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({});

      const response = await request(app).delete('/fixtures/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Fixture removed successfully');
    });
  });

  describe('GET /fixtures/search', () => {
    it('should search fixtures with pagination', async () => {
      // Mock the find method to return an array of fixtures
      (Fixture.find as jest.Mock).mockResolvedValueOnce([
        { homeTeam: 'Team A', awayTeam: 'Team B', date: '2024-10-18' },
        { homeTeam: 'Team C', awayTeam: 'Team D', date: '2024-10-19' },
      ]);

      const response = await request(app).get('/fixtures/search?homeTeam=Team A&page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fixtures');
      expect(response.body.pagination).toHaveProperty('currentPage', 1);
    });
  });

  describe('GET /fixtures/:id', () => {
    it('should fetch a fixture by id', async () => {
      // Mock the findById method to return a specific fixture
      (Fixture.findById as jest.Mock).mockResolvedValueOnce({
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        date: '2024-10-18',
      });

      const response = await request(app).get('/fixtures/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
