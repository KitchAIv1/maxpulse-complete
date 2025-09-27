// MAXPULSE Dashboard - Google Sheets Validator Service
// File: dashboard/src/services/GoogleSheetsValidator.ts
// Purpose: Validate activation codes against company Google Sheets

interface DistributorRecord {
  name: string;
  email: string;
  activationCode: string;
  status: 'active' | 'used' | 'expired';
  usedDate: string | null;
  purchaseId: string;
  territory: string;
}

interface ValidationResult {
  isValid: boolean;
  distributorData?: DistributorRecord;
  error?: string;
  errorCode?: 'CODE_NOT_FOUND' | 'CODE_USED' | 'NAME_MISMATCH' | 'API_ERROR' | 'RATE_LIMITED';
}

interface CacheEntry {
  data: ValidationResult;
  timestamp: number;
}

export class GoogleSheetsValidator {
  private static readonly SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  private static readonly API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
  private static readonly MAX_ATTEMPTS_PER_HOUR = 10;
  
  private static cache = new Map<string, CacheEntry>();
  private static rateLimitTracker = new Map<string, { attempts: number; resetTime: number }>();
  
  /**
   * Validate activation code against Google Sheets
   */
  static async validateActivationCode(
    name: string, 
    email: string, 
    code: string,
    clientIP: string = 'unknown'
  ): Promise<ValidationResult> {
    try {
      // 1. Rate limiting check
      if (!this.checkRateLimit(clientIP)) {
        return { 
          isValid: false, 
          error: 'Too many validation attempts. Please try again later.', 
          errorCode: 'RATE_LIMITED' 
        };
      }

      // 2. Format validation
      if (!this.isValidCodeFormat(code)) {
        this.trackAttempt(clientIP);
        return { 
          isValid: false, 
          error: 'Invalid activation code format (Expected: MP-YYYY-XXXXXX)', 
          errorCode: 'INVALID_FORMAT' 
        };
      }
      
      // 3. Check cache first
      const cachedResult = this.getCachedValidation(code);
      if (cachedResult) {
        console.log('🔄 Using cached validation result for code:', code.substring(0, 8) + '...');
        return cachedResult;
      }
      
      // 4. Google Sheets API call
      console.log('🔍 Validating activation code via Google Sheets API...');
      console.log('📋 Fetching sheet data...');
      const sheetData = await this.fetchSheetData();
      console.log('📊 Sheet data received:', sheetData?.length || 0, 'rows');
      console.log('🔍 Looking for code:', code);
      const distributorRecord = this.findDistributorByCode(sheetData, code);
      console.log('👤 Distributor record found:', distributorRecord ? 'YES' : 'NO');
      
      if (!distributorRecord) {
        this.trackAttempt(clientIP);
        return { 
          isValid: false, 
          error: 'Activation code not found in our records', 
          errorCode: 'CODE_NOT_FOUND' 
        };
      }
      
      if (distributorRecord.status === 'used') {
        this.trackAttempt(clientIP);
        return { 
          isValid: false, 
          error: 'This activation code has already been used', 
          errorCode: 'CODE_USED' 
        };
      }
      
      // 5. Name matching (fuzzy)
      if (!this.isNameMatch(name, distributorRecord.name)) {
        this.trackAttempt(clientIP);
        return { 
          isValid: false, 
          error: 'Name does not match our records for this activation code', 
          errorCode: 'NAME_MISMATCH' 
        };
      }
      
      // 6. Cache and return success
      const result = { isValid: true, distributorData: distributorRecord };
      this.cacheValidation(code, result);
      console.log('✅ Activation code validated successfully');
      return result;
      
    } catch (error) {
      console.error('Google Sheets validation error:', error);
      this.trackAttempt(clientIP);
      return { 
        isValid: false, 
        error: 'Validation service temporarily unavailable. Please try again.', 
        errorCode: 'API_ERROR' 
      };
    }
  }
  
  /**
   * Mark activation code as used in Google Sheets
   */
  static async markCodeAsUsed(code: string, userData: { userId: string; email: string }): Promise<boolean> {
    try {
      console.log('📝 Marking activation code as used in Google Sheets...');
      
      // For now, we'll simulate this operation since it requires service account setup
      // In production, this would update the Google Sheet with used status and timestamp
      
      // Remove from cache since status has changed
      this.cache.delete(code);
      
      console.log('✅ Activation code marked as used (simulated)');
      return true;
      
    } catch (error) {
      console.error('Error marking code as used:', error);
      return false;
    }
  }
  
  /**
   * Get distributor information by activation code
   */
  static async getDistributorByCode(code: string): Promise<DistributorRecord | null> {
    try {
      const sheetData = await this.fetchSheetData();
      return this.findDistributorByCode(sheetData, code);
    } catch (error) {
      console.error('Error fetching distributor data:', error);
      return null;
    }
  }
  
  /**
   * Clear validation cache (for testing/admin purposes)
   */
  static clearCache(): void {
    this.cache.clear();
    console.log('🧹 Validation cache cleared');
  }
  
  /**
   * Private helper methods
   */
  private static isValidCodeFormat(code: string): boolean {
    // Accept both letters and numbers in the last part: MP-YYYY-XXXXXX or MP-YYYY-MMMMMM
    return /^MP-\d{4}-[A-Z0-9]{6}$/.test(code);
  }
  
  private static isNameMatch(inputName: string, recordName: string): boolean {
    // Normalize names for comparison
    const normalize = (name: string) => 
      name.toLowerCase()
          .replace(/[^a-z\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
    
    const input = normalize(inputName);
    const record = normalize(recordName);
    
    // Exact match
    if (input === record) return true;
    
    // Split into parts for partial matching
    const inputParts = input.split(' ').filter(part => part.length > 1);
    const recordParts = record.split(' ').filter(part => part.length > 1);
    
    // Check if at least 2 name parts match (for first + last name scenarios)
    const matchingParts = inputParts.filter(part => 
      recordParts.some(recordPart => 
        recordPart.includes(part) || part.includes(recordPart)
      )
    );
    
    return matchingParts.length >= Math.min(2, inputParts.length);
  }
  
  private static getCachedValidation(code: string): ValidationResult | null {
    const cached = this.cache.get(code);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(code); // Remove expired cache
    }
    return null;
  }
  
  private static cacheValidation(code: string, result: ValidationResult): void {
    this.cache.set(code, {
      data: result,
      timestamp: Date.now()
    });
  }
  
  private static checkRateLimit(clientIP: string): boolean {
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(clientIP);
    
    if (!tracker) return true;
    
    // Reset if window has passed
    if (now > tracker.resetTime) {
      this.rateLimitTracker.delete(clientIP);
      return true;
    }
    
    return tracker.attempts < this.MAX_ATTEMPTS_PER_HOUR;
  }
  
  private static trackAttempt(clientIP: string): void {
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(clientIP);
    
    if (!tracker || now > tracker.resetTime) {
      this.rateLimitTracker.set(clientIP, {
        attempts: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
    } else {
      tracker.attempts++;
    }
  }
  
  private static async fetchSheetData(): Promise<any[]> {
    try {
      // Use FeatureFlags to get the values (this was working before)
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
      
      console.log('🔑 API Key available:', apiKey ? 'YES' : 'NO');
      console.log('📄 Sheet ID available:', sheetId ? 'YES' : 'NO');
      
      if (!apiKey || !sheetId) {
        throw new Error('Google Sheets configuration missing. Please check environment variables.');
      }
      
      const range = 'Sheet1!A:G'; // Columns A through G
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      
      console.log('🌐 Making API request to Google Sheets...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        if (response.status === 403) {
          throw new Error('Google Sheets API access denied. Please check API key permissions.');
        } else if (response.status === 404) {
          throw new Error('Google Sheet not found. Please check sheet ID.');
        } else {
          throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Sheet data received:', data.values ? `${data.values.length} rows` : 'No data');
      return data.values || [];
      
    } catch (error) {
      console.error('❌ fetchSheetData error:', error);
      throw error;
    }
  }
  
  private static findDistributorByCode(sheetData: any[], code: string): DistributorRecord | null {
    console.log('🔍 DEBUG: Looking for code:', code);
    console.log('📊 DEBUG: Sheet data structure:', sheetData);
    
    // Skip header row (index 0)
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      console.log(`📋 DEBUG: Row ${i}:`, row);
      console.log(`🔍 DEBUG: Comparing "${row[2]}" === "${code}":`, row[2] === code);
      console.log(`📏 DEBUG: Length check - row[2]: ${row[2]?.length}, code: ${code.length}`);
      console.log(`🔤 DEBUG: Trimmed comparison:`, row[2]?.trim() === code.trim());
      
      // Try both exact match and trimmed match to handle whitespace issues
      const cellValue = row[2]?.toString().trim() || '';
      if (row.length >= 3 && (row[2] === code || cellValue === code.trim())) { // Activation code is in column C (index 2)
        console.log('✅ DEBUG: Match found!');
        return {
          name: row[0] || '',           // Column A
          email: row[1] || '',          // Column B  
          activationCode: row[2] || '', // Column C
          status: row[3] || 'active',   // Column D
          usedDate: row[4] || null,     // Column E
          purchaseId: row[5] || '',     // Column F
          territory: row[6] || ''       // Column G
        };
      }
    }
    console.log('❌ DEBUG: No match found for code:', code);
    return null;
  }
  
  /**
   * Development/testing helper - simulate Google Sheets data
   */
  private static getTestSheetData(): any[] {
    return [
      ['Distributor Name', 'Email', 'Activation Code', 'Status', 'Used Date', 'Purchase ID', 'Territory'],
      ['John Smith', 'john@example.com', 'MP-2024-001234', 'active', null, 'PO-12345', 'West'],
      ['Sarah Johnson', 'sarah@example.com', 'MP-2024-001235', 'active', null, 'PO-12346', 'East'],
      ['Mike Wilson', 'mike@example.com', 'MP-2024-001236', 'used', '2024-01-15', 'PO-12347', 'North']
    ];
  }
}

// Export types for use in other components
export type { DistributorRecord, ValidationResult };
