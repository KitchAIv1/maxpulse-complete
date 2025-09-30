import { useCallback } from 'react';

/**
 * Custom hook for clipboard and sharing functionality
 * Extracted from LinkGeneration.tsx to follow .cursorrules
 * 
 * Provides copy to clipboard and share functionality
 */
export function useClipboard() {
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    console.log('📋 Copied to clipboard');
  }, []);

  const shareLink = useCallback(async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        console.log('📤 Shared successfully');
      } catch (error) {
        console.log('📋 Share cancelled, copying to clipboard instead');
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  }, [copyToClipboard]);

  return {
    copyToClipboard,
    shareLink
  };
}
