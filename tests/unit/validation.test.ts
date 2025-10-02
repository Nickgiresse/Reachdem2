// Tests unitaires pour les fonctions de validation

describe('Validation Functions', () => {
  // Fonction de validation d'email
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Rejeter les emails avec des points consécutifs
    if (email.includes('..')) return false;
    return emailRegex.test(email);
  }

  // Fonction de validation de numéro de téléphone camerounais
  function isValidCameroonPhone(phone: string): boolean {
    const cleaned = phone.replace(/\s/g, '').trim();
    // Regex pour numéros camerounais: +237 ou 237 suivi de 9 chiffres commençant par 6-9
    const phoneRegex = /^(\+237|237)?[6-9][0-9]{8}$/;
    return phoneRegex.test(cleaned);
  }

  // Fonction de validation de montant
  function isValidAmount(amount: string | number): boolean {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(numAmount) && numAmount > 0 && numAmount >= 100;
  }

  test('should validate email correctly', () => {
    // Emails valides
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    expect(isValidEmail('test+tag@example.org')).toBe(true);
    
    // Emails invalides
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('test..test@example.com')).toBe(false);
  });

  test('should validate Cameroon phone numbers correctly', () => {
    // Numéros valides
    expect(isValidCameroonPhone('+237612345678')).toBe(true);
    expect(isValidCameroonPhone('237612345678')).toBe(true);
    expect(isValidCameroonPhone('612345678')).toBe(true);
    expect(isValidCameroonPhone('+237 612 345 678')).toBe(true);
    expect(isValidCameroonPhone('698765432')).toBe(true);
    
    // Numéros invalides
    expect(isValidCameroonPhone('12345678')).toBe(false); // Trop court
    expect(isValidCameroonPhone('1234567890')).toBe(false); // Trop long
    expect(isValidCameroonPhone('123456789')).toBe(false); // Commence par 1
    expect(isValidCameroonPhone('+23712345678')).toBe(false); // Trop court avec indicatif
    expect(isValidCameroonPhone('')).toBe(false);
  });

  test('should validate amounts correctly', () => {
    // Montants valides
    expect(isValidAmount('1000')).toBe(true);
    expect(isValidAmount(5000)).toBe(true);
    expect(isValidAmount('10000.50')).toBe(true);
    expect(isValidAmount(100)).toBe(true);
    
    // Montants invalides
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount(-100)).toBe(false);
    expect(isValidAmount('50')).toBe(false); // Moins de 100
    expect(isValidAmount('invalid')).toBe(false);
    expect(isValidAmount('')).toBe(false);
    expect(isValidAmount(NaN)).toBe(false);
  });

  test('should handle edge cases in validation', () => {
    // Test avec des espaces
    expect(isValidCameroonPhone('  +237 612 345 678  ')).toBe(true);
    
    // Test avec des caractères spéciaux
    expect(isValidEmail('test+special@example.com')).toBe(true);
    
    // Test avec des décimales
    expect(isValidAmount('1000.99')).toBe(true);
    expect(isValidAmount('99.99')).toBe(false); // Moins de 100
  });
});
