import { hashPassword, verifyPassword } from '@/lib/argon2-server';

describe('Argon2 Password Hashing', () => {
  test('should hash password successfully', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(50);
    expect(hash).not.toBe(password);
  });

  test('should verify correct password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword({ password, hash });
    expect(isValid).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const password = 'testPassword123';
    const wrongPassword = 'wrongPassword456';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword({ password: wrongPassword, hash });
    expect(isValid).toBe(false);
  });

  test('should handle empty password', async () => {
    const password = '';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
  });

  test('should handle special characters in password', async () => {
    const password = 'Test@123#$%^&*()';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword({ password, hash });
    expect(isValid).toBe(true);
  });
});
