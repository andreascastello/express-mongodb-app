import request from 'supertest';
import mockingoose from 'mockingoose';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../../app.js';
import User from '../../models/User.js';

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123'
      };

      // Mock that no user exists with this email
      mockingoose(User).toReturn(null, 'findOne');
      
      // Mock successful save
      const savedUser = {
        _id: new mongoose.Types.ObjectId(),
        email: userData.email,
        password: 'hashedPassword',
        isAdmin: false
      };
      mockingoose(User).toReturn(savedUser, 'save');

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('Utilisateur créé.');
    });

    it('should return 400 when email is missing', async () => {
      const userData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Email et mot de passe requis.');
    });

    it('should return 400 when password is missing', async () => {
      const userData = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Email et mot de passe requis.');
    });

    it('should return 409 when email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      const existingUser = {
        _id: new mongoose.Types.ObjectId(),
        email: userData.email,
        password: 'hashedPassword'
      };

      mockingoose(User).toReturn(existingUser, 'findOne');

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe('Cet email est déjà utilisé.');
    });

    it('should handle server error during registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockingoose(User).toReturn(null, 'findOne');
      mockingoose(User).toReturn(new Error('Database error'), 'save');

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(500);

      expect(response.body.message).toBe('Erreur serveur.');
    });
  });

  describe('Password Hashing', () => {
    it('should hash password during registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockingoose(User).toReturn(null, 'findOne');
      
      // Mock the save operation to capture the hashed password
      let savedUserData = null;
      mockingoose(User).toReturn((user) => {
        savedUserData = user;
        return Promise.resolve(user);
      }, 'save');

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Verify that the password was hashed
      expect(savedUserData.password).not.toBe(userData.password);
      expect(savedUserData.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt pattern
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'test123@subdomain.example.com'
      ];

      for (const email of validEmails) {
        const userData = {
          email,
          password: 'password123'
        };

        mockingoose(User).toReturn(null, 'findOne');
        mockingoose(User).toReturn({
          _id: new mongoose.Types.ObjectId(),
          email,
          password: 'hashedPassword'
        }, 'save');

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.message).toBe('Utilisateur créé.');
      }
    });
  });
}); 