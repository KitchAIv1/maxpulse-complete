// MAXPULSE Platform - Assessment Link Helper
// File: dashboard/src/utils/assessmentLinkHelper.ts
// Purpose: Utility to reconstruct assessment links from session data
// .cursorrules compliant: Utility <100 lines, single purpose

/**
 * Reconstruct assessment link from session data
 * Format matches actual link generator: baseUrl/assessment/?distributor=CODE&customer=NAME&email=EMAIL&code=SESSION_CODE&session=SESSION_ID
 */
export function reconstructAssessmentLink(
  sessionCode: string,
  distributorCode: string,
  customerName?: string,
  customerEmail?: string,
  baseUrl: string = window.location.origin
): string {
  // Use same logic as useLinkGeneration hook
  const assessmentBaseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5174/assessment' 
    : `${window.location.origin}/assessment`;
  
  // Extract customer info from session code if not provided
  // Session format: WB2025991-test28-mgb124w5-cuj26q
  const parts = sessionCode.split('-');
  const extractedName = parts[1] || 'Client';
  
  // Generate session ID in same format as link generator
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  
  // Build query parameters to match link generator format
  const params = new URLSearchParams({
    distributor: distributorCode,
    customer: customerName || extractedName,
    email: customerEmail || 'client@email.com',
    code: sessionCode,
    session: sessionId
  });
  
  return `${assessmentBaseUrl}/?${params.toString()}`;
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

