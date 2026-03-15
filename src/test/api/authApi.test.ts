import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { authApi } from '../../api/auth.api';

describe('authApi', () => {
  describe('login', () => {
    it('returns token and user info on success', async () => {
      const result = await authApi.login({ username: 'testuser', password: 'password123' });
      expect(result.token).toBe('mock-jwt-token');
      expect(result.username).toBe('testuser');
      expect(result.role).toBe('CUSTOMER');
    });

    it('throws on invalid credentials', async () => {
      server.use(
        http.post('http://localhost:8080/api/v1/users/login', () => {
          return HttpResponse.json(
            { timestamp: new Date(), status: 401, error: 'Unauthorized', message: 'Invalid username or password' },
            { status: 401 }
          );
        })
      );
      await expect(authApi.login({ username: 'bad', password: 'bad' })).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('creates a new user and returns UserDTO', async () => {
      const result = await authApi.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result.username).toBe('testuser');
      expect(result.status).toBe('ACTIVE');
    });

    it('throws on duplicate username', async () => {
      server.use(
        http.post('http://localhost:8080/api/v1/users/register', () => {
          return HttpResponse.json(
            { status: 409, error: 'Conflict', message: 'Username already taken' },
            { status: 409 }
          );
        })
      );
      await expect(
        authApi.register({ username: 'testuser', email: 'x@x.com', password: 'password123' })
      ).rejects.toThrow();
    });
  });
});
