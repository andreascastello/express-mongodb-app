import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import auth from '../../middlewares/auth.js';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('Token Validation', () => {
    it('should return 401 when no authorization header', () => {
      auth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token manquant.' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is malformed', () => {
      mockReq.headers.authorization = 'InvalidFormat';
      auth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token manquant.' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when Bearer token is missing', () => {
      mockReq.headers.authorization = 'Bearer ';
      auth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token manquant.' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      auth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token invalide.' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() when token is valid for Node.js API', () => {
      const token = jwt.sign(
        { userId: 'user123', isAdmin: false },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      mockReq.headers.authorization = `Bearer ${token}`;
      auth(mockReq, mockRes, mockNext);
      // Le payload contient aussi exp et iat
      expect(mockReq.user).toMatchObject({
        userId: 'user123',
        isAdmin: false
      });
      expect(typeof mockReq.user.exp).toBe('number');
      expect(typeof mockReq.user.iat).toBe('number');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle Python API token format correctly', () => {
      const pythonToken = jwt.sign(
        { data: [{ email: 'admin@example.com' }] },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      mockReq.headers.authorization = `Bearer ${pythonToken}`;
      auth(mockReq, mockRes, mockNext);
      expect(mockReq.user).toMatchObject({
        userId: 'admin',
        isAdmin: true,
        email: 'admin@example.com'
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle Python API token with multiple data entries', () => {
      const pythonToken = jwt.sign(
        { data: [ { email: 'admin@example.com' }, { email: 'other@example.com' } ] },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      mockReq.headers.authorization = `Bearer ${pythonToken}`;
      auth(mockReq, mockRes, mockNext);
      expect(mockReq.user).toMatchObject({
        userId: 'admin',
        isAdmin: true,
        email: 'admin@example.com'
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle Python API token without data array', () => {
      const pythonToken = jwt.sign(
        { data: null },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      mockReq.headers.authorization = `Bearer ${pythonToken}`;
      auth(mockReq, mockRes, mockNext);
      // On ne vérifie rien, on s'assure juste qu'il n'y a pas de crash
    });
  });

  describe('Token Expiration', () => {
    it('should return 403 when token is expired', () => {
      const expiredToken = jwt.sign(
        { userId: 'user123', isAdmin: false },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' }
      );
      mockReq.headers.authorization = `Bearer ${expiredToken}`;
      auth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token invalide.' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle JWT verification errors gracefully', () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      mockReq.headers.authorization = `Bearer ${invalidToken}`;
      auth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token invalide.' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 