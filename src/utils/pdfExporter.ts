import { jsPDF } from 'jspdf';
import { ChatMessage } from '@/types/chat';
import { ActiveClientState } from '@/types/client';

export const exportChatToPDF = (
  client: ActiveClientState,
  messages: ChatMessage[],
  scoreCard?: {
    professionalism: number;
    scopeManagement: number;
    negotiationSkill: number;
    overallRating: number;
    feedbackText: string;
  }
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Document margins
  const margin = 20;
  const docWidth = 210;
  const contentWidth = docWidth - (margin * 2);
  
  // Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241); // Indigo color
  doc.text('Faclie', margin, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate color
  doc.setFont('helvetica', 'medium');
  doc.text('ADVANCED CLIENT SIMULATION LOG', margin, 30);
  doc.text(`Date Exported: ${new Date().toLocaleString()}`, docWidth - margin - 60, 30);
  
  // Horizontal separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 34, docWidth - margin, 34);
  
  // Client & Project Summary Panel
  doc.setFillColor(248, 250, 252); // Soft gray panel
  doc.roundedRect(margin, 39, contentWidth, 36, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Dark slate
  doc.text('SIMULATION PROFILE', margin + 5, 45);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Client Name:  ${client.name}`, margin + 5, 52);
  doc.text(`Role/Company: ${client.role} at ${client.company}`, margin + 5, 58);
  doc.text(`Difficulty:   ${client.difficulty.toUpperCase()}`, margin + 5, 64);
  
  doc.text(`Final Client Health: ${client.healthScore}%`, margin + 90, 52);
  doc.text(`Active Pipeline:     ${client.projectPipelineStage.toUpperCase()}`, margin + 90, 58);
  doc.text(`Active Emotional:    ${client.currentState.activeMood.toUpperCase()}`, margin + 90, 64);
  
  // Rapor Penilaian (Scorecard) rendering
  let yPosition = 96;
  
  if (scoreCard) {
    const scoreY = 78;
    const scoreHeight = 54;
    
    // Light gray card background with thin border
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, scoreY, contentWidth, scoreHeight, 3, 3, 'FD');
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(99, 102, 241); // Indigo color
    doc.text('PERFORMANCE EVALUATION REPORT', margin + 5, scoreY + 6);
    
    // Rank/Grade Title
    const getRankName = (score: number) => {
      if (score >= 90) return 'Elite Freelance Consultant';
      if (score >= 75) return 'Professional Contractor';
      if (score >= 50) return 'Midweight Agency Lead';
      return 'Junior Spec Builder';
    };
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Overall Rating: ${scoreCard.overallRating}% - ${getRankName(scoreCard.overallRating)}`, margin + 5, scoreY + 12);
    
    // Progress Bars: Column 1
    const drawProgressBar = (label: string, value: number, x: number, y: number, color: [number, number, number]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // Slate-600
      doc.text(`${label}: ${value}%`, x, y);
      
      // Track (Background bar)
      doc.setFillColor(226, 232, 240);
      doc.rect(x, y + 2, 70, 2, 'F');
      
      // Fill (Colored indicator bar)
      doc.setFillColor(...color);
      doc.rect(x, y + 2, (value / 100) * 70, 2, 'F');
    };
    
    drawProgressBar('Professionalism', scoreCard.professionalism, margin + 5, scoreY + 18, [99, 102, 241]); // Indigo
    drawProgressBar('Scope Management', scoreCard.scopeManagement, margin + 5, scoreY + 28, [245, 158, 11]); // Amber
    drawProgressBar('Negotiation Skill', scoreCard.negotiationSkill, margin + 5, scoreY + 38, [16, 185, 129]); // Emerald
    
    // Feedback column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('Evaluation Feedback:', margin + 85, scoreY + 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const feedbackLines = doc.splitTextToSize(scoreCard.feedbackText, contentWidth - 90);
    doc.text(feedbackLines, margin + 85, scoreY + 17);
    
    // Set layout starting position for conversation
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.text('CONVERSATION HISTORY', margin, scoreY + scoreHeight + 10);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, scoreY + scoreHeight + 13, docWidth - margin, scoreY + scoreHeight + 13);
    
    yPosition = scoreY + scoreHeight + 20;
  } else {
    // Original placement if no scorecard
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.text('CONVERSATION HISTORY', margin, 86);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 89, docWidth - margin, 89);
    
    yPosition = 96;
  }
  
  doc.setFontSize(9.5);
  
  messages.forEach((msg) => {
    // Check page boundaries: if yPosition exceeds A4 page height (297mm), add a page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 25; // Reset position on new page
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 15, docWidth - margin, 15);
      yPosition = 22;
    }
    
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let senderLabel = '';
    let senderColor: [number, number, number] = [0, 0, 0];
    
    if (msg.sender === 'user') {
      senderLabel = 'YOU (Freelancer)';
      senderColor = [99, 102, 241]; // Indigo
    } else if (msg.sender === 'client') {
      senderLabel = client.name.toUpperCase();
      senderColor = [15, 23, 42]; // Dark slate
    } else {
      senderLabel = 'SYSTEM';
      senderColor = [245, 158, 11]; // Amber
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...senderColor);
    doc.text(`${senderLabel} [${time}]`, margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85); // Slate-700
    
    // Split text to fit line limits
    const textLines = doc.splitTextToSize(msg.text, contentWidth);
    doc.text(textLines, margin, yPosition + 4.5);
    
    // Add extra info if voice note or intent tag
    let heightOffset = 6 + (textLines.length * 4.5);
    if (msg.detectedIntent && msg.sender === 'user') {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`[Detected Intent: ${msg.detectedIntent.replace(/_/g, ' ')}]`, margin, yPosition + heightOffset - 1);
      heightOffset += 4;
      doc.setFontSize(9.5);
    }
    
    yPosition += heightOffset;
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, docWidth / 2 - 10, 287);
    doc.text('Powered by Faclie advanced client simulator', margin, 287);
  }
  
  // Trigger file download
  doc.save(`faclie_sim_${client.id}.pdf`);
};
