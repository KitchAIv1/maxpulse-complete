/**
 * Analysis Download Button Component
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Provide PDF download functionality for V2 analysis results
 * External add-on - does NOT modify any existing components or data
 */

import React, { useState, useRef } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PDFExportManager } from '../services/PDFExportManager';

interface AnalysisDownloadButtonProps {
  customerName?: string;
  distributorName?: string;
  elementId?: string; // ID of element to capture (defaults to 'analysis-content')
}

export function AnalysisDownloadButton({
  customerName = 'MAXPULSE User',
  distributorName,
  elementId = 'analysis-content'
}: AnalysisDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadStatus('idle');

      // Get the analysis content element
      const element = document.getElementById(elementId);

      if (!element) {
        throw new Error('Analysis content not found. Please ensure the page is fully loaded.');
      }

      // Validate element is ready
      if (!PDFExportManager.isElementReady(element)) {
        throw new Error('Analysis content is not ready. Please wait a moment and try again.');
      }

      // Generate PDF
      await PDFExportManager.generateBrandedPDF(element, {
        customerName,
        distributorName,
        filename: 'MAXPULSE-Health-Analysis',
        title: 'Your Personalized Health Analysis',
        subtitle: 'Powered by MAXPULSE V2 Engine',
        quality: 0.95
      });

      // Show success feedback
      setDownloadStatus('success');
      
      // Reset after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setDownloadStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('error');
      
      // Reset after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setDownloadStatus('idle');
      }, 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Button appearance based on status
  const getButtonStyles = () => {
    if (downloadStatus === 'success') {
      return 'bg-green-600 hover:bg-green-700 border-green-500';
    }
    if (downloadStatus === 'error') {
      return 'bg-red-600 hover:bg-red-700 border-red-500';
    }
    return 'bg-gradient-to-r from-purple-900 to-purple-600 hover:from-purple-800 hover:to-purple-500 border-purple-700';
  };

  const getButtonIcon = () => {
    if (isDownloading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    if (downloadStatus === 'success') {
      return <CheckCircle className="w-4 h-4" />;
    }
    if (downloadStatus === 'error') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return <Download className="w-4 h-4" />;
  };

  const getButtonText = () => {
    if (isDownloading) {
      return 'Generating PDF...';
    }
    if (downloadStatus === 'success') {
      return 'Downloaded!';
    }
    if (downloadStatus === 'error') {
      return 'Failed - Retry';
    }
    return 'Download Analysis';
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
        text-white text-sm font-semibold
        border shadow-lg hover:shadow-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getButtonStyles()}
      `}
      aria-label="Download analysis as PDF"
    >
      {getButtonIcon()}
      <span>{getButtonText()}</span>
    </button>
  );
}

/**
 * Compact version for tight spaces
 */
export function AnalysisDownloadButtonCompact({
  customerName = 'MAXPULSE User',
  distributorName,
  elementId = 'analysis-content'
}: AnalysisDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById(elementId);
      
      if (!element || !PDFExportManager.isElementReady(element)) {
        throw new Error('Content not ready');
      }

      await PDFExportManager.generateBrandedPDF(element, {
        customerName,
        distributorName,
        filename: 'MAXPULSE-Health-Analysis',
        quality: 0.95
      });
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="
        p-2 rounded-lg
        bg-white/10 hover:bg-white/20
        border border-white/20
        text-white
        transition-all duration-200
        disabled:opacity-50
      "
      title="Download PDF"
      aria-label="Download analysis as PDF"
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
    </button>
  );
}

