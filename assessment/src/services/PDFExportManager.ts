/**
 * PDF Export Manager
 * Following .cursorrules: <200 lines, single responsibility
 * Purpose: Generate PDF exports of V2 analysis results
 * External add-on - does NOT modify any existing components or data
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportOptions {
  customerName?: string;
  filename?: string;
  quality?: number; // 0.1 to 1.0
}

export class PDFExportManager {
  /**
   * Generate PDF from HTML element
   * Uses html2canvas to capture visual content, then embeds in PDF
   */
  static async generatePDFFromElement(
    element: HTMLElement,
    options: PDFExportOptions = {}
  ): Promise<void> {
    try {
      const {
        customerName = 'MAXPULSE User',
        filename = 'MAXPULSE-Health-Analysis',
        quality = 0.95
      } = options;

      // Step 1: Capture HTML element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        allowTaint: false
      });

      // Step 2: Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Step 3: Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', quality);

      // Step 4: Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Step 5: Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Step 6: Add additional pages if content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Step 7: Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = customerName.replace(/[^a-z0-9]/gi, '-');
      const finalFilename = `${filename}_${sanitizedName}_${timestamp}.pdf`;

      // Step 8: Save PDF
      pdf.save(finalFilename);

      return Promise.resolve();
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Generate PDF with custom branding and metadata
   */
  static async generateBrandedPDF(
    element: HTMLElement,
    options: PDFExportOptions & {
      title?: string;
      subtitle?: string;
      distributorName?: string;
    } = {}
  ): Promise<void> {
    try {
      const {
        customerName = 'MAXPULSE User',
        filename = 'MAXPULSE-Health-Analysis',
        title = 'Your Personalized Health Analysis',
        subtitle = 'Powered by MAXPULSE V2 Engine',
        distributorName,
        quality = 0.95
      } = options;

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', quality);

      const pdf = new jsPDF('p', 'mm', 'a4');

      // Add header with branding
      pdf.setFontSize(20);
      pdf.setTextColor(139, 21, 56); // MAXPULSE brand color
      pdf.text('MAXPULSE', 105, 15, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(title, 105, 22, { align: 'center' });

      if (distributorName) {
        pdf.setFontSize(10);
        pdf.text(`Distributor: ${distributorName}`, 105, 28, { align: 'center' });
      }

      // Add main content
      pdf.addImage(imgData, 'JPEG', 0, 35, imgWidth, imgHeight);

      // Add footer
      const totalPages = Math.ceil(imgHeight / pageHeight);
      for (let i = 1; i <= totalPages; i++) {
        if (i > 1) {
          pdf.addPage();
          pdf.addImage(
            imgData,
            'JPEG',
            0,
            -(pageHeight * (i - 1)) + 35,
            imgWidth,
            imgHeight
          );
        }
        
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
          105,
          290,
          { align: 'center' }
        );
      }

      // Save with metadata
      pdf.setProperties({
        title: `${title} - ${customerName}`,
        subject: 'Health Analysis Report',
        author: 'MAXPULSE Platform',
        keywords: 'health, analysis, personalized, assessment',
        creator: 'MAXPULSE V2 Analysis Engine'
      });

      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = customerName.replace(/[^a-z0-9]/gi, '-');
      const finalFilename = `${filename}_${sanitizedName}_${timestamp}.pdf`;

      pdf.save(finalFilename);

      return Promise.resolve();
    } catch (error) {
      console.error('❌ Branded PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Validate if element is ready for PDF export
   */
  static isElementReady(element: HTMLElement | null): boolean {
    if (!element) return false;
    
    // Check if element has content
    if (element.childNodes.length === 0) return false;
    
    // Check if element is visible
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    
    return true;
  }
}

