import { jest } from '@jest/globals';
import request from 'supertest';
import mockingoose from 'mockingoose';
import mongoose from 'mongoose';
import app from '../../app.js';
import Post from '../../models/Post.js';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';

describe('Posts API Integration Tests', () => {
  let adminToken;
  let mockPost;

  beforeEach(() => {
    mockingoose.resetAll();
    mockPost = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Test Post',
      content: 'This is a test post content',
      author: new mongoose.Types.ObjectId(),
      createdAt: new Date()
    };
    adminToken = jwt.sign(
      { userId: 'admin', isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/posts', () => {
    it('should create a new post successfully', async () => {
      const newPost = {
        title: 'New Post',
        content: 'This is a new post content'
      };
      mockingoose(Post).toReturn({ ...mockPost, ...newPost }, 'save');
      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
    });
    it('should handle server error when creating post', async () => {
      const newPost = {
        title: 'New Post',
        content: 'This is a new post content'
      };
      mockingoose(Post).toReturn(new Error('Database error'), 'save');
      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(500);
      expect(response.body.message).toBe('Erreur serveur.');
    });
  });

  describe('GET /api/posts', () => {
    it('should return all posts successfully', async () => {
      const posts = [
        { ...mockPost, _id: new mongoose.Types.ObjectId() },
        { ...mockPost, _id: new mongoose.Types.ObjectId(), title: 'Second Post', content: 'Second post content' }
      ];
      mockingoose(Post).toReturn(posts, 'find');
      const response = await request(app)
        .get('/api/posts')
        .expect(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Test Post');
      expect(response.body[1].title).toBe('Second Post');
    });
    it('should handle empty posts list', async () => {
      mockingoose(Post).toReturn([], 'find');
      const response = await request(app)
        .get('/api/posts')
        .expect(200);
      expect(response.body).toHaveLength(0);
    });
    it('should handle server error when fetching posts', async () => {
      mockingoose(Post).toReturn(new Error('Database error'), 'find');
      const response = await request(app)
        .get('/api/posts')
        .expect(500);
      expect(response.body.message).toBe('Erreur serveur.');
    });
  });
}); 