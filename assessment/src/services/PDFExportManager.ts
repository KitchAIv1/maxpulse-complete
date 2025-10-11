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
   * Get color for grade badge
   */
  private static getGradeColor(grade: string): { r: number; g: number; b: number } {
    const gradeColors: Record<string, { r: number; g: number; b: number }> = {
      'A+': { r: 34, g: 197, b: 94 },   // Green
      'A': { r: 34, g: 197, b: 94 },
      'B+': { r: 59, g: 130, b: 246 },  // Blue
      'B': { r: 59, g: 130, b: 246 },
      'C+': { r: 251, g: 146, b: 60 },  // Orange
      'C': { r: 251, g: 146, b: 60 },
      'D': { r: 239, g: 68, b: 68 },    // Red
      'F': { r: 220, g: 38, b: 38 }     // Dark Red
    };
    return gradeColors[grade] || { r: 100, g: 100, b: 100 }; // Default gray
  }

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
   * CUSTOM LAYOUT - Does NOT use html2canvas, builds PDF directly from text
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
        distributorName
      } = options;

      // ✅ NEW APPROACH: Extract text content and build custom PDF layout
      const extractedData = this.extractAnalysisData(element);

      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPos = 20;
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // ========== BEAUTIFUL HEADER WITH LOGO ==========
      // Red background bar at top
      pdf.setFillColor(220, 38, 38); // MAXPULSE red
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      // MAXPULSE logo/text in white
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MAXPULSE', pageWidth / 2, 18, { align: 'center' });
      
      // Subtitle in white
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('HEALTH ANALYSIS REPORT', pageWidth / 2, 27, { align: 'center' });
      
      yPos = 45;
      
      // Client info box with subtle background
      pdf.setFillColor(248, 250, 252); // Light gray
      pdf.roundedRect(margin, yPos, contentWidth, 18, 2, 2, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`CLIENT: ${customerName.toUpperCase()}`, margin + 5, yPos + 7);
      pdf.text(`GENERATED: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 5, yPos + 13);
      
      if (distributorName) {
        pdf.text(`DISTRIBUTOR: ${distributorName}`, pageWidth - margin - 5, yPos + 10, { align: 'right' });
      }
      
      yPos += 25;

      // ========== EXECUTIVE SUMMARY BOX ==========
      if (extractedData.overallScore) {
        // Main score box with border
        pdf.setDrawColor(220, 38, 38);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, yPos, contentWidth, 30, 3, 3, 'S');
        
        // Left section - Health Score
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'normal');
        pdf.text('HEALTH SCORE', margin + 10, yPos + 10);
        
        pdf.setFontSize(36);
        pdf.setTextColor(220, 38, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text(extractedData.overallScore, margin + 10, yPos + 24);
        
        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.text('/100', margin + 30, yPos + 24);
        
        // Center divider line
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.line(pageWidth / 2, yPos + 5, pageWidth / 2, yPos + 25);
        
        // Right section - Grade Badge
        if (extractedData.grade) {
          // Grade circle
          const gradeColor = this.getGradeColor(extractedData.grade);
          pdf.setFillColor(gradeColor.r, gradeColor.g, gradeColor.b);
          pdf.circle(pageWidth - margin - 30, yPos + 15, 12, 'F');
          
          pdf.setFontSize(24);
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.text(extractedData.grade, pageWidth - margin - 30, yPos + 19, { align: 'center' });
          
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.setFont('helvetica', 'normal');
          pdf.text('GRADE', pageWidth - margin - 30, yPos + 27, { align: 'center' });
        }
        
        yPos += 38;
      }

      // ========== KEY FINDINGS (Clean 2-column layout) ==========
      if (extractedData.keyFindings.length > 0) {
        // Section header with red underline
        pdf.setFontSize(13);
        pdf.setTextColor(220, 38, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KEY HEALTH INSIGHTS', margin, yPos);
        
        pdf.setDrawColor(220, 38, 38);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 2, margin + 60, yPos + 2);
        yPos += 8;

        pdf.setFontSize(8.5);
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'normal');
        
        const colWidth = (contentWidth - 8) / 2;
        const maxFindingsPerColumn = 4;
        
        // Display only most important findings (first 8, 4 per column)
        const displayFindings = extractedData.keyFindings.slice(0, 8);
        
        displayFindings.forEach((finding, index) => {
          const col = Math.floor(index / maxFindingsPerColumn);
          const rowInCol = index % maxFindingsPerColumn;
          const xPos = margin + (col * (colWidth + 8));
          const yStart = yPos + (rowInCol * 20);
          
          if (yStart > 260) {
            pdf.addPage();
            yPos = 20;
            return;
          }
          
          // Bullet point
          pdf.setFillColor(220, 38, 38);
          pdf.circle(xPos + 1.5, yStart - 1, 1, 'F');
          
          // Finding text
          const lines = pdf.splitTextToSize(finding, colWidth - 5);
          pdf.text(lines.slice(0, 3), xPos + 4, yStart); // Limit to 3 lines per finding
        });
        
        yPos += (Math.min(maxFindingsPerColumn, displayFindings.length) * 20) + 5;
      }

      // ========== HEALTH TARGETS (Professional Table) ==========
      if (extractedData.targets.length > 0) {
        if (yPos > 230) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Section header
        pdf.setFontSize(13);
        pdf.setTextColor(220, 38, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text('YOUR PERSONALIZED TARGETS', margin, yPos);
        
        pdf.setDrawColor(220, 38, 38);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 2, margin + 80, yPos + 2);
        yPos += 10;

        // Define column widths (must match row columns)
        const col1Width = 35; // Metric
        const col2Width = 45; // Current
        const col3Width = 45; // Target
        const col4Width = 25; // Improvement arrow
        
        // Table header
        pdf.setFillColor(220, 38, 38);
        pdf.rect(margin, yPos, contentWidth, 8, 'F');
        
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text('METRIC', margin + 2, yPos + 5.5);
        pdf.text('CURRENT', margin + col1Width + 2, yPos + 5.5);
        pdf.text('TARGET', margin + col1Width + col2Width + 2, yPos + 5.5);
        pdf.text('→', margin + col1Width + col2Width + col3Width + 10, yPos + 5.5);
        yPos += 8;

        // Table rows with proper column widths and text wrapping
        pdf.setFontSize(7.5);
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'normal');
        
        extractedData.targets.forEach((target, index) => {
          // Better page break logic - check if we have space for the full row
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
          }
          
          // Clean and truncate text to prevent overflow
          const cleanMetric = target.metric.length > 25 ? target.metric.substring(0, 25) + '...' : target.metric;
          const cleanCurrent = target.current.length > 30 ? target.current.substring(0, 30) + '...' : target.current;
          const cleanTarget = target.target.length > 30 ? target.target.substring(0, 30) + '...' : target.target;
          
          // Calculate row height based on content (limit to 2 lines max per cell)
          const metricLines = pdf.splitTextToSize(cleanMetric, col1Width - 4).slice(0, 2);
          const currentLines = pdf.splitTextToSize(cleanCurrent, col2Width - 4).slice(0, 2);
          const targetLines = pdf.splitTextToSize(cleanTarget, col3Width - 4).slice(0, 2);
          const maxLines = Math.max(metricLines.length, currentLines.length, targetLines.length);
          const rowHeight = Math.max(10, maxLines * 4 + 4);
          
          // Alternating row background
          if (index % 2 === 0) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin, yPos, contentWidth, rowHeight, 'F');
          }
          
          // Column 1: Metric (bold)
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(50, 50, 50);
          pdf.text(metricLines, margin + 2, yPos + 4);
          
          // Column 2: Current (normal)
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(50, 50, 50);
          pdf.text(currentLines, margin + col1Width + 2, yPos + 4);
          
          // Column 3: Target (bold red)
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(220, 38, 38);
          pdf.text(targetLines, margin + col1Width + col2Width + 2, yPos + 4);
          
          // Column 4: Improvement arrow (green)
          pdf.setTextColor(34, 197, 94);
          pdf.setFontSize(10);
          pdf.text('→', margin + col1Width + col2Width + col3Width + 8, yPos + (rowHeight / 2) + 1);
          pdf.setFontSize(7.5); // Reset font size
          
          pdf.setTextColor(50, 50, 50);
          yPos += rowHeight;
        });
        
        yPos += 5;
      }

      // ========== TRANSFORMATION PLAN (Beautiful Phase Design) ==========
      if (extractedData.transformationPlan.length > 0) {
        // Always start transformation plan on a new page for better layout
        pdf.addPage();
        yPos = 20;
        
        // Section header
        pdf.setFontSize(13);
        pdf.setTextColor(220, 38, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text('90-DAY TRANSFORMATION PLAN', margin, yPos);
        
        pdf.setDrawColor(220, 38, 38);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 2, margin + 90, yPos + 2);
        yPos += 10;

        extractedData.transformationPlan.forEach((phase, phaseIndex) => {
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
          }
          
          // Phase header with red background
          pdf.setFillColor(220, 38, 38);
          pdf.roundedRect(margin, yPos, contentWidth, 8, 1, 1, 'F');
          
          pdf.setFontSize(10);
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.text(phase.title.toUpperCase(), margin + 3, yPos + 5.5);
          yPos += 10;
          
          // Phase actions as numbered list
          pdf.setFontSize(8.5);
          pdf.setTextColor(50, 50, 50);
          pdf.setFont('helvetica', 'normal');
          
          phase.actions.slice(0, 5).forEach((action, actionIndex) => { // Limit to 5 actions per phase
            if (yPos > 270) {
              pdf.addPage();
              yPos = 20;
            }
            
            // Action number circle
            pdf.setFillColor(220, 38, 38);
            pdf.circle(margin + 3, yPos + 1.5, 2, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${actionIndex + 1}`, margin + 3, yPos + 2.5, { align: 'center' });
            
            // Action text
            pdf.setFontSize(8.5);
            pdf.setTextColor(50, 50, 50);
            pdf.setFont('helvetica', 'normal');
            const actionLines = pdf.splitTextToSize(action, contentWidth - 10);
            pdf.text(actionLines.slice(0, 2), margin + 7, yPos + 3); // Limit to 2 lines
            yPos += (Math.min(actionLines.length, 2) * 4) + 2;
          });
          
          yPos += 3;
        });
      }

      // ========== PROFESSIONAL FOOTER ON ALL PAGES ==========
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Footer line
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.line(margin, 283, pageWidth - margin, 283);
        
        // Left side - MAXPULSE branding
        pdf.setFontSize(8);
        pdf.setTextColor(220, 38, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MAXPULSE', margin, 288);
        
        // Center - page number
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 288, { align: 'center' });
        
        // Right side - confidential
        pdf.setFontSize(7);
        pdf.text('Confidential Health Report', pageWidth - margin, 288, { align: 'right' });
      }

      // Save PDF
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
   * Extract structured data from analysis HTML
   */
  private static extractAnalysisData(element: HTMLElement): {
    overallScore: string;
    grade: string;
    keyFindings: string[];
    targets: Array<{metric: string; current: string; target: string}>;
    transformationPlan: Array<{title: string; actions: string[]}>;
  } {
    const data = {
      overallScore: '',
      grade: '',
      keyFindings: [] as string[],
      targets: [] as Array<{metric: string; current: string; target: string}>,
      transformationPlan: [] as Array<{title: string; actions: string[]}>
    };

    // Extract overall score - look for score number in various places
    const allText = element.textContent || '';
    const scoreMatch = allText.match(/(?:Score|score)[\s:]*(\d+)[\s/]*100/i) || 
                       allText.match(/Your.*?(\d+)\/100/i);
    if (scoreMatch) {
      data.overallScore = scoreMatch[1];
    }

    // Extract grade - look for letter grades
    const gradeMatch = allText.match(/Grade[\s:]*([A-F][+-]?)/i) || 
                       allText.match(/\b([A-F][+-]?)\s*Grade/i);
    if (gradeMatch) {
      data.grade = gradeMatch[1];
    }

    // Extract key findings - limit to most important (first 8)
    const paragraphs = element.querySelectorAll('p');
    let findingCount = 0;
    paragraphs.forEach(p => {
      if (findingCount >= 8) return; // Limit findings
      const text = p.textContent?.trim();
      if (text && text.length > 30 && text.length < 300 && 
          !text.includes('Download') && !text.includes('button')) {
        data.keyFindings.push(text);
        findingCount++;
      }
    });

    // Extract targets - look for current → target patterns
    const targetElements = element.querySelectorAll('*');
    const seenTargets = new Set<string>();
    
    targetElements.forEach(el => {
      const text = el.textContent?.trim() || '';
      
      // Match patterns like "Sleep: 6 hours → 8 hours" or "6 hours → 8 hours"
      const targetPatterns = [
        /(Sleep|Hydration|Steps|Energy|Exercise|Weight|BMI|Mood)[\s:]*([^→\n]+)→\s*([^\n•]+)/i,
        /(Daily|Weekly|Current)?\s*(Sleep|Hydration|Steps|Energy|Exercise|Weight|BMI)[\s:]*([^→\n]+)→\s*([^\n•]+)/i
      ];
      
      for (const pattern of targetPatterns) {
        const targetMatch = text.match(pattern);
        if (targetMatch && targetMatch[0].length < 150) {
          const metric = (targetMatch[2] || targetMatch[1]).trim();
          const current = (targetMatch[3] || targetMatch[2]).trim();
          const target = (targetMatch[4] || targetMatch[3]).trim().split(/[•\n]/)[0].trim();
          
          const key = `${metric}:${current}:${target}`;
          if (!seenTargets.has(key) && data.targets.length < 8) {
            seenTargets.add(key);
            data.targets.push({
              metric,
              current,
              target
            });
          }
          break;
        }
      }
    });

    // Extract transformation plan - look for Phase headings
    const allElements = element.querySelectorAll('*');
    let currentPhase: {title: string; actions: string[]} | null = null;
    
    allElements.forEach(el => {
      const text = el.textContent?.trim() || '';
      
      // Detect phase headers
      if (text.match(/Phase\s+\d+/i) && text.length < 100) {
        if (currentPhase && currentPhase.actions.length > 0) {
          data.transformationPlan.push(currentPhase);
        }
        currentPhase = {
          title: text.split('\n')[0].trim(),
          actions: []
        };
      }
      // Collect actions for current phase (look for bullet points or action items)
      else if (currentPhase && text.length > 20 && text.length < 200) {
        if (text.match(/^(•|-|\d+\.)\s/) || 
            text.match(/(Sleep|Drink|Walk|Eat|Track|Exercise|Focus|Add)/i)) {
          const action = text.replace(/^(•|-|\d+\.)\s*/, '').trim();
          if (!currentPhase.actions.includes(action) && currentPhase.actions.length < 6) {
            currentPhase.actions.push(action);
          }
        }
      }
    });
    
    // Add last phase
    if (currentPhase && currentPhase.actions.length > 0) {
      data.transformationPlan.push(currentPhase);
    }

    // If no phases found, create a default transformation plan
    if (data.transformationPlan.length === 0) {
      const actionItems: string[] = [];
      
      // Look for any action-like items or create defaults
      allElements.forEach(el => {
        const text = el.textContent?.trim() || '';
        if (text.match(/^(•|-)\s/) && text.length > 15 && text.length < 200) {
          const action = text.replace(/^(•|-)\s*/, '').trim();
          if (actionItems.length < 12) {
            actionItems.push(action);
          }
        }
      });
      
      // If still no actions found, create default ones based on targets
      if (actionItems.length === 0 && data.targets.length > 0) {
        data.targets.forEach(target => {
          if (target.metric.toLowerCase().includes('sleep')) {
            actionItems.push(`Improve sleep quality: ${target.current} → ${target.target}`);
          } else if (target.metric.toLowerCase().includes('hydration')) {
            actionItems.push(`Increase daily hydration: ${target.current} → ${target.target}`);
          } else if (target.metric.toLowerCase().includes('steps')) {
            actionItems.push(`Boost daily activity: ${target.current} → ${target.target}`);
          } else {
            actionItems.push(`Focus on ${target.metric}: ${target.current} → ${target.target}`);
          }
        });
      }
      
      if (actionItems.length > 0) {
        // Group actions into 3 phases
        const phase1Count = Math.ceil(actionItems.length / 3);
        const phase2Count = Math.ceil((actionItems.length - phase1Count) / 2);
        
        data.transformationPlan.push({
          title: 'Phase 1: Foundation (Days 1-30)',
          actions: actionItems.slice(0, phase1Count)
        });
        
        if (actionItems.length > phase1Count) {
          data.transformationPlan.push({
            title: 'Phase 2: Building (Days 31-60)',
            actions: actionItems.slice(phase1Count, phase1Count + phase2Count)
          });
        }
        
        if (actionItems.length > phase1Count + phase2Count) {
          data.transformationPlan.push({
            title: 'Phase 3: Transformation (Days 61-90)',
            actions: actionItems.slice(phase1Count + phase2Count)
          });
        }
      }
    }

    console.log('📊 Extracted PDF Data:', {
      score: data.overallScore,
      grade: data.grade,
      findingsCount: data.keyFindings.length,
      targetsCount: data.targets.length,
      phasesCount: data.transformationPlan.length
    });

    return data;
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

