import mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import Post from '../../models/Post.js';

describe('Post Model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('Validation', () => {
    it('should create a valid post', async () => {
      const validPost = {
        title: 'Test Post',
        content: 'This is a test post content',
        author: new mongoose.Types.ObjectId(),
        createdAt: new Date()
      };

      mockingoose(Post).toReturn(validPost, 'save');
      
      const post = new Post(validPost);
      const savedPost = await post.save();
      
      expect(savedPost.title).toBe(validPost.title);
      expect(savedPost.content).toBe(validPost.content);
      expect(savedPost.author.toString()).toBe(validPost.author.toString());
    });

    it('should require title field', async () => {
      const invalidPost = {
        content: 'This is a test post content'
      };

      const post = new Post(invalidPost);
      let error;
      
      try {
        await post.validate();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.title).toBeDefined();
    });

    it('should require content field', async () => {
      const invalidPost = {
        title: 'Test Post'
      };

      const post = new Post(invalidPost);
      let error;
      
      try {
        await post.validate();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.content).toBeDefined();
    });

    it('should set default createdAt date', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content'
      };

      const post = new Post(postData);
      expect(post.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Schema Structure', () => {
    it('should have correct schema fields', () => {
      const postSchema = Post.schema;
      
      expect(postSchema.paths.title).toBeDefined();
      expect(postSchema.paths.content).toBeDefined();
      expect(postSchema.paths.author).toBeDefined();
      expect(postSchema.paths.createdAt).toBeDefined();
    });

    it('should have correct field types', () => {
      const postSchema = Post.schema;
      
      expect(postSchema.paths.title.instance).toBe('String');
      expect(postSchema.paths.content.instance).toBe('String');
      expect(postSchema.paths.author.instance).toBe('ObjectId');
      expect(postSchema.paths.createdAt.instance).toBe('Date');
    });
  });
}); 