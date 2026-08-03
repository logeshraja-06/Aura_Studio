import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportBookingsPDF(filteredBookings, filterTitle = 'All Bookings') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Sort bookings by event date ascending
  const sorted = [...filteredBookings].sort((a, b) => {
    const da = new Date(a.eventDate || 0).getTime();
    const db = new Date(b.eventDate || 0).getTime();
    return da - db;
  });

  // Dark Control Room Header Backdrop (#0A0A0A)
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 297, 45, 'F');

  // Gold Accent Line (#C9A227)
  doc.setDrawColor(201, 162, 39);
  doc.setLineWidth(1.5);
  doc.line(0, 45, 297, 45);

  // Studio Wordmark Header
  doc.setTextColor(201, 162, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AURA CINEMATIC LUXURY WEDDING STUDIO', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 220, 220);
  doc.text('EXECUTIVE LOGISTICS & CLIENT RESERVATIONS AUDIT REPORT', 14, 26);

  // Metadata right aligned
  doc.setFontSize(9);
  doc.setTextColor(201, 162, 39);
  doc.text(`Generated: ${dateStr}`, 283, 18, { align: 'right' });
  doc.setTextColor(180, 180, 180);
  doc.text(`Filter View: ${filterTitle} | Total Records: ${sorted.length}`, 283, 26, { align: 'right' });

  // Prepare table rows
  const tableData = sorted.map((b, i) => [
    i + 1,
    b.name || 'N/A',
    b.packageName || b.serviceId || 'Wedding Photography',
    b.eventDate || 'TBD',
    b.location || 'Not Specified',
    (b.status || 'pending').toUpperCase(),
    b.phone || 'N/A',
    b.email || 'N/A',
  ]);

  // AutoTable styling
  autoTable(doc, {
    startY: 52,
    head: [['#', 'Customer Name', 'Service / Package', 'Event Date', 'Location', 'Status', 'Phone', 'Email']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 26, 26],
      textColor: [201, 162, 39],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [30, 30, 30],
      fontSize: 8.5,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [248, 246, 240],
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 50 },
      3: { cellWidth: 28, fontStyle: 'bold' },
      4: { cellWidth: 45 },
      5: { cellWidth: 25, fontStyle: 'bold', halign: 'center' },
      6: { cellWidth: 32 },
      7: { cellWidth: 45 },
    },
    didParseCell: function (data) {
      // Color-code status cell
      if (data.section === 'body' && data.column.index === 5) {
        const val = data.cell.raw;
        if (val === 'CONFIRMED') {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fillColor = [220, 252, 231];
        } else if (val === 'PENDING') {
          data.cell.styles.textColor = [180, 130, 20];
          data.cell.styles.fillColor = [254, 249, 195];
        } else if (val === 'CANCELLED') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fillColor = [254, 226, 226];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Footer on page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `AURA Studio Control Room Confidential Document • Page ${i} of ${pageCount}`,
      14,
      202
    );
  }

  const filename = `AURA_Bookings_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
