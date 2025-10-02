import { test, expect } from '@playwright/test';

test.describe('Campaign Creation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - simulate logged in user
    await page.goto('/login');
    
    // Mock successful login
    await page.route('**/api/auth/sign-in/email', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, user: { id: 'user_123', email: 'test@example.com' } })
      });
    });
    
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should complete full campaign creation process', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/projects', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { project_id: 'project_123', sender_name: 'Test Project', is_active: true }
        ])
      });
    });

    await page.route('**/api/groups', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { group_id: 'group_123', name: 'Test Group', description: 'Test group description' }
        ])
      });
    });

    await page.route('**/api/campaigns', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            campaign_id: 'campaign_123',
            name: 'Campagne Test E2E',
            status: 'SCHEDULED',
            created_at: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // 1. Naviguer vers les campagnes
    await page.click('[data-testid="campaigns-nav"]');
    await expect(page).toHaveURL('/dashboard/campagne');
    
    // 2. Créer une nouvelle campagne
    await page.click('[data-testid="new-campaign-button"]');
    
    // 3. Remplir le formulaire de campagne
    await page.fill('[data-testid="campaign-name"]', 'Campagne Test E2E');
    await page.selectOption('[data-testid="project-select"]', 'project_123');
    await page.selectOption('[data-testid="group-select"]', 'group_123');
    await page.fill('[data-testid="message-content"]', 'Message de test pour la campagne E2E');
    
    // 4. Programmer la campagne
    await page.check('[data-testid="schedule-campaign"]');
    await page.fill('[data-testid="schedule-date"]', '2024-12-01');
    await page.fill('[data-testid="schedule-time"]', '10:00');
    
    // 5. Sauvegarder la campagne
    await page.click('[data-testid="save-campaign"]');
    
    // 6. Vérifier que la campagne a été créée
    await expect(page.locator('[data-testid="campaign-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="campaign-list"]')).toContainText('Campagne Test E2E');
    
    // 7. Vérifier le statut de la campagne
    await expect(page.locator('[data-testid="campaign-status"]')).toContainText('Programmée');
  });

  test('should handle campaign creation errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/campaigns', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Le nom de la campagne est obligatoire' })
        });
      }
    });

    await page.goto('/dashboard/campagne');
    await page.click('[data-testid="new-campaign-button"]');
    
    // Essayer de sauvegarder sans remplir les champs requis
    await page.click('[data-testid="save-campaign"]');
    
    // Vérifier que les erreurs de validation s'affichent
    await expect(page.locator('[data-testid="campaign-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="project-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="group-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-error"]')).toBeVisible();
  });

  test('should display campaign list correctly', async ({ page }) => {
    // Mock campaigns data
    await page.route('**/api/campaigns', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'campaign_1',
            name: 'Campagne Marketing',
            channel: 'SMS',
            createdAt: '2024-09-26',
            status: 'Envoyée',
            project: 'Test Project',
            group: 'Test Group',
            message: 'Message de test'
          },
          {
            id: 'campaign_2',
            name: 'Campagne Promotion',
            channel: 'SMS',
            createdAt: '2024-09-25',
            status: 'En cours',
            project: 'Test Project',
            group: 'Test Group',
            message: 'Message promotionnel'
          }
        ])
      });
    });

    await page.goto('/dashboard/campagne');
    
    // Vérifier que la liste des campagnes s'affiche
    await expect(page.locator('[data-testid="campaign-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="campaign-item"]')).toHaveCount(2);
    
    // Vérifier le contenu des campagnes
    await expect(page.locator('[data-testid="campaign-name"]').first()).toContainText('Campagne Marketing');
    await expect(page.locator('[data-testid="campaign-status"]').first()).toContainText('Envoyée');
  });
});
