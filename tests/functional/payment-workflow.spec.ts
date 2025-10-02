import { test, expect } from '@playwright/test';

test.describe('NotchPay Payment Workflow', () => {
  test('should complete payment process successfully', async ({ page }) => {
    // Mock NotchPay API responses
    await page.route('**/api/create-payment', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            transaction: {
              reference: 'txn_123456',
              amount: 5000,
              currency: 'XAF',
              status: 'pending',
              checkout_url: 'https://checkout.notchpay.co/test'
            }
          }
        })
      });
    });

    // Mock successful payment callback
    await page.route('**/api/payment-callback**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          transaction: {
            reference: 'txn_123456',
            amount: 5000,
            status: 'completed',
            customer: {
              email: 'test@example.com',
              name: 'John Doe'
            }
          }
        })
      });
    });

    // 1. Aller à la page de test de paiement
    await page.goto('/payment-test');
    
    // 2. Remplir le formulaire de paiement
    await page.fill('[data-testid="amount"]', '5000');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="name"]', 'John Doe');
    
    // 3. Initier le paiement
    await page.click('[data-testid="pay-button"]');
    
    // 4. Vérifier que le checkout NotchPay s'ouvre (simulation)
    await expect(page.locator('[data-testid="notchpay-checkout"]')).toBeVisible();
    
    // 5. Simuler un paiement réussi (en mode test)
    await page.click('[data-testid="test-payment-success"]');
    
    // 6. Vérifier la redirection vers la page de succès
    await expect(page).toHaveURL('/success');
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Paiement réussi');
    
    // 7. Vérifier que les détails du paiement s'affichent
    await expect(page.locator('[data-testid="payment-amount"]')).toContainText('5,000 FCFA');
    await expect(page.locator('[data-testid="payment-email"]')).toContainText('test@example.com');
    await expect(page.locator('[data-testid="transaction-reference"]')).toContainText('txn_123456');
  });

  test('should handle payment failure gracefully', async ({ page }) => {
    // Mock payment failure
    await page.route('**/api/create-payment', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid payment data'
        })
      });
    });

    await page.goto('/payment-test');
    
    // Remplir avec des données invalides
    await page.fill('[data-testid="amount"]', '0');
    await page.fill('[data-testid="email"]', 'invalid-email');
    
    await page.click('[data-testid="pay-button"]');
    
    // Vérifier que les erreurs de validation s'affichent
    await expect(page.locator('[data-testid="amount-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    
    // Corriger les données et simuler un échec de paiement
    await page.fill('[data-testid="amount"]', '5000');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="name"]', 'John Doe');
    
    // Mock payment failure
    await page.route('**/api/payment-callback**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Payment failed',
          transaction: {
            reference: 'txn_123456',
            status: 'failed'
          }
        })
      });
    });
    
    await page.click('[data-testid="pay-button"]');
    await page.click('[data-testid="test-payment-failure"]');
    
    // Vérifier la redirection vers la page d'erreur
    await expect(page).toHaveURL('/error');
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Échec du paiement');
  });

  test('should validate payment form fields', async ({ page }) => {
    await page.goto('/payment-test');
    
    // Test validation des champs requis
    await page.click('[data-testid="pay-button"]');
    
    // Vérifier les messages d'erreur
    await expect(page.locator('[data-testid="amount-error"]')).toContainText('Le montant est requis');
    await expect(page.locator('[data-testid="email-error"]')).toContainText('L\'email est requis');
    await expect(page.locator('[data-testid="name-error"]')).toContainText('Le nom est requis');
    
    // Test validation du format email
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.click('[data-testid="pay-button"]');
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Format d\'email invalide');
    
    // Test validation du montant minimum
    await page.fill('[data-testid="amount"]', '100');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="name"]', 'John Doe');
    await page.click('[data-testid="pay-button"]');
    await expect(page.locator('[data-testid="amount-error"]')).toContainText('Le montant minimum est de 1000 FCFA');
  });

  test('should display payment history', async ({ page }) => {
    // Mock payment history
    await page.route('**/api/payment-history', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            reference: 'txn_001',
            amount: 5000,
            status: 'completed',
            created_at: '2024-09-26T10:00:00Z',
            customer: { email: 'test@example.com', name: 'John Doe' }
          },
          {
            reference: 'txn_002',
            amount: 10000,
            status: 'failed',
            created_at: '2024-09-25T15:30:00Z',
            customer: { email: 'test2@example.com', name: 'Jane Smith' }
          }
        ])
      });
    });

    await page.goto('/dashboard/historique');
    
    // Vérifier que l'historique des paiements s'affiche
    await expect(page.locator('[data-testid="payment-history"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-item"]')).toHaveCount(2);
    
    // Vérifier le contenu des paiements
    await expect(page.locator('[data-testid="payment-reference"]').first()).toContainText('txn_001');
    await expect(page.locator('[data-testid="payment-amount"]').first()).toContainText('5,000 FCFA');
    await expect(page.locator('[data-testid="payment-status"]').first()).toContainText('completed');
  });
});
