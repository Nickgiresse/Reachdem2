// Tests unitaires pour les fonctions de formatage

describe('Formatting Functions', () => {
  // Fonction de formatage de montant en FCFA
  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Fonction de formatage de numéro de téléphone
  function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('237')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 9) {
      return `+237${cleaned}`;
    }
    return phone;
  }

  // Fonction de formatage de date
  function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Fonction de formatage de nom
  function formatName(firstName: string, lastName: string): string {
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}`;
  }

  test('should format amounts correctly', () => {
    // Utiliser des espaces insécables pour la comparaison
    expect(formatAmount(1000)).toMatch(/1\s000\sFCFA/);
    expect(formatAmount(5000)).toMatch(/5\s000\sFCFA/);
    expect(formatAmount(100000)).toMatch(/100\s000\sFCFA/);
    expect(formatAmount(0)).toMatch(/0\sFCFA/);
    expect(formatAmount(100.50)).toMatch(/101\sFCFA/); // Arrondi
  });

  test('should format phone numbers correctly', () => {
    expect(formatPhoneNumber('123456789')).toBe('+237123456789');
    expect(formatPhoneNumber('237123456789')).toBe('+237123456789');
    expect(formatPhoneNumber('+237123456789')).toBe('+237123456789');
    expect(formatPhoneNumber('+237 123 456 789')).toBe('+237123456789');
    expect(formatPhoneNumber('invalid')).toBe('invalid');
  });

  test('should format dates correctly', () => {
    const testDate = new Date('2024-09-26T10:30:00Z');
    expect(formatDate(testDate)).toBe('26 septembre 2024');
    
    // Ajuster pour le fuseau horaire
    const testDateString = '2024-12-25T12:00:00Z'; // Midday pour éviter les problèmes de fuseau
    expect(formatDate(testDateString)).toBe('25 décembre 2024');
  });

  test('should format names correctly', () => {
    expect(formatName('john', 'doe')).toBe('John Doe');
    expect(formatName('JANE', 'SMITH')).toBe('Jane Smith');
    expect(formatName('jean-pierre', 'martin')).toBe('Jean-pierre Martin');
    expect(formatName('m', 'k')).toBe('M K');
  });

  test('should handle edge cases in formatting', () => {
    // Test avec des montants très grands
    expect(formatAmount(1000000)).toMatch(/1\s000\s000\sFCFA/);
    
    // Test avec des noms vides
    expect(formatName('', 'doe')).toBe(' Doe');
    expect(formatName('john', '')).toBe('John ');
    
    // Test avec des dates invalides - la fonction ne lance pas d'erreur, elle retourne "Invalid Date"
    const invalidDate = formatDate('invalid-date');
    expect(invalidDate).toContain('Invalid');
  });
});
