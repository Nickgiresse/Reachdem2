import { NextRequest } from 'next/server';
import { POST } from '@/app/api/campaigns/route';

// Mock Prisma
const mockPrisma = {
  campaign: {
    create: jest.fn()
  },
  project: {
    findFirst: jest.fn()
  },
  group: {
    findFirst: jest.fn()
  },
  message: {
    create: jest.fn()
  },
  campaignMessage: {
    create: jest.fn()
  },
  $disconnect: jest.fn()
};

jest.mock('@/generated/prisma', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}));

describe('Campaigns API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create campaign with message successfully', async () => {
    const campaignData = {
      name: 'Test Campaign',
      projectId: 'project_123',
      groupId: 'group_123',
      message: 'Hello from ReachDem!',
      scheduledAt: '2024-12-01T10:00:00Z'
    };

    // Mock successful database operations
    mockPrisma.project.findFirst.mockResolvedValue({
      project_id: 'project_123',
      sender_name: 'Test Project'
    });
    mockPrisma.group.findFirst.mockResolvedValue({
      group_id: 'group_123',
      name: 'Test Group'
    });
    mockPrisma.campaign.create.mockResolvedValue({
      campaign_id: 'campaign_123',
      name: 'Test Campaign',
      status: 'DRAFT',
      created_at: new Date()
    });
    mockPrisma.message.create.mockResolvedValue({
      message_id: 'message_123',
      content: 'Hello from ReachDem!'
    });
    mockPrisma.campaignMessage.create.mockResolvedValue({
      campaign_id: 'campaign_123',
      message_id: 'message_123'
    });

    const request = new NextRequest('http://localhost:3000/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.campaign_id).toBe('campaign_123');
    expect(data.name).toBe('Test Campaign');
    expect(mockPrisma.campaign.create).toHaveBeenCalled();
    expect(mockPrisma.message.create).toHaveBeenCalled();
    expect(mockPrisma.campaignMessage.create).toHaveBeenCalled();
  });

  test('should handle campaign creation with invalid data', async () => {
    const invalidData = {
      // name manquant
      projectId: 'project_123',
      groupId: 'group_123'
    };

    const request = new NextRequest('http://localhost:3000/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Le nom de la campagne est obligatoire');
  });

  test('should handle missing project', async () => {
    const campaignData = {
      name: 'Test Campaign',
      projectId: 'nonexistent_project',
      groupId: 'group_123',
      message: 'Hello from ReachDem!'
    };

    // Mock project not found
    mockPrisma.project.findFirst.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain('Projet non trouvé');
  });

  test('should handle missing group', async () => {
    const campaignData = {
      name: 'Test Campaign',
      projectId: 'project_123',
      groupId: 'nonexistent_group',
      message: 'Hello from ReachDem!'
    };

    // Mock project found but group not found
    mockPrisma.project.findFirst.mockResolvedValue({
      project_id: 'project_123',
      sender_name: 'Test Project'
    });
    mockPrisma.group.findFirst.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain('Groupe non trouvé');
  });

  test('should handle database errors gracefully', async () => {
    const campaignData = {
      name: 'Test Campaign',
      projectId: 'project_123',
      groupId: 'group_123',
      message: 'Hello from ReachDem!'
    };

    // Mock database error
    mockPrisma.project.findFirst.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Erreur lors de la création de la campagne');
  });
});
