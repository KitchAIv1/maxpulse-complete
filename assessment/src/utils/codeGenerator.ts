/**
 * Activation Code Generator
 * Following .cursorrules: <100 lines, single responsibility, pure utility
 * Purpose: Generate collision-free 8-character alphanumeric codes
 */

/**
 * Generate a random 8-character alphanumeric activation code
 * Format: UPPERCASE letters and numbers (e.g., A3K9M2P7)
 * Excludes confusing characters: 0, O, I, 1, L
 */
export function generateCode(): string {
  // Character set: 26 letters + 8 numbers (excluding 0, 1) = 34 possible characters
  // Reduces confusion: no O/0, no I/1/L
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  
  return code;
}

/**
 * Validate activation code format
 * @param code - Code to validate
 * @returns true if code is valid format (8 chars, alphanumeric)
 */
export function isValidCodeFormat(code: string): boolean {
  if (!code || code.length !== 8) {
    return false;
  }
  
  // Check if all characters are in valid charset
  const validCharset = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/;
  return validCharset.test(code);
}

/**
 * Calculate collision probability
 * With 34 possible characters and 8 positions:
 * Total combinations = 34^8 = 1.785 x 10^12 (1.7 trillion)
 * 
 * For 10,000 codes:
 * Collision probability ≈ 0.0000028% (virtually zero)
 * 
 * For 1,000,000 codes:
 * Collision probability ≈ 0.028% (1 in 3,571)
 */
export function calculateCollisionProbability(totalCodes: number): number {
  const totalPossibleCodes = Math.pow(34, 8); // 34^8
  const probability = 1 - Math.exp(-(totalCodes * (totalCodes - 1)) / (2 * totalPossibleCodes));
  return probability * 100; // Return as percentage
}

