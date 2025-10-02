import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contacts/route';

// Mock Prisma
const mockPrisma = {
  contact: {
    create: jest.fn()
  },
  phonebook: {
    findFirst: jest.fn(),
    create: jest.fn()
  },
  user: {
    findFirst: jest.fn(),
    create: jest.fn()
  },
  project: {
    findFirst: jest.fn(),
    create: jest.fn()
  }
};

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}));

describe('Contacts API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create contact successfully', async () => {
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+237123456789',
      address: 'Douala, Cameroon'
    };

    // Mock successful database operations
    mockPrisma.phonebook.findFirst.mockResolvedValue({
      phonebook_id: 'phonebook_123',
      name: 'Contacts par défaut'
    });
    mockPrisma.contact.create.mockResolvedValue({
      contact_id: 'contact_123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+237123456789',
      address: 'Douala, Cameroon',
      created_at: new Date()
    });

    const request = new NextRequest('http://localhost:3000/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.contact_id).toBe('contact_123');
    expect(data.first_name).toBe('John');
    expect(data.last_name).toBe('Doe');
    expect(data.email).toBe('john.doe@example.com');
    expect(data.phone).toBe('+237123456789');
  });

  test('should return error for missing required fields', async () => {
    const invalidData = {
      firstName: 'John',
      // lastName manquant
      phone: '+237123456789'
    };

    const request = new NextRequest('http://localhost:3000/api/contacts', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('champs nom, prénom et téléphone sont requis');
  });

  test('should create default phonebook if none exists', async () => {
    const contactData = {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+237987654321'
    };

    // Mock no existing phonebook
    mockPrisma.phonebook.findFirst.mockResolvedValue(null);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 'user_123',
      email: 'default@example.com'
    });
    mockPrisma.project.findFirst.mockResolvedValue({
      project_id: 'project_123',
      sender_name: 'Projet par défaut'
    });
    mockPrisma.phonebook.create.mockResolvedValue({
      phonebook_id: 'phonebook_456',
      name: 'Contacts par défaut'
    });
    mockPrisma.contact.create.mockResolvedValue({
      contact_id: 'contact_456',
      ...contactData,
      created_at: new Date()
    });

    const request = new NextRequest('http://localhost:3000/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(mockPrisma.phonebook.create).toHaveBeenCalled();
    expect(data.contact_id).toBe('contact_456');
  });

  test('should handle database errors gracefully', async () => {
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+237123456789'
    };

    // Mock database error
    mockPrisma.phonebook.findFirst.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Erreur lors de la création du contact');
  });
});
