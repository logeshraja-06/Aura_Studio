import * as XLSX from 'xlsx';

export function exportBookingsExcel(bookings, filterTitle = 'All Bookings') {
  // Sort bookings by event date ascending
  const sorted = [...bookings].sort((a, b) => {
    const da = new Date(a.eventDate || 0).getTime();
    const db = new Date(b.eventDate || 0).getTime();
    return da - db;
  });

  // Sheet 1: Filtered Bookings Data
  const mainData = sorted.map((b, idx) => ({
    '#': idx + 1,
    'Client Name': b.name || '',
    'Email Address': b.email || '',
    'Phone Number': b.phone || '',
    'Service / Package': b.packageName || b.serviceId || 'Wedding Photography',
    'Event Date': b.eventDate || 'TBD',
    'Venue Location': b.location || 'Not Specified',
    'Guest Count': b.guestCount || '',
    'Status': (b.status || 'pending').toUpperCase(),
    'Total Contract (INR)': b.totalAmount || 0,
    'Advance Paid (INR)': b.advanceAmount || 0,
    'Balance Due (INR)': b.balanceDue || 0,
    'Special Notes': b.notes || '',
    'Submitted On': b.createdAt ? new Date(b.createdAt).toLocaleString() : '',
  }));

  const mainSheet = XLSX.utils.json_to_sheet(mainData);

  // Set column widths
  mainSheet['!cols'] = [
    { wch: 5 },
    { wch: 28 },
    { wch: 30 },
    { wch: 18 },
    { wch: 32 },
    { wch: 14 },
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 45 },
    { wch: 22 },
  ];

  // Sheet 2: Executive Summary Tab
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;
  const totalRev = bookings.reduce((sum, b) => sum + (b.totalAmount || 210000), 0);

  const summaryData = [
    { Metric: 'Report Filter View', Value: filterTitle },
    { Metric: 'Generated On', Value: new Date().toLocaleString() },
    { Metric: 'Total Bookings Count', Value: totalCount },
    { Metric: 'Confirmed Bookings', Value: confirmedCount },
    { Metric: 'Pending Inquiries', Value: pendingCount },
    { Metric: 'Cancelled Bookings', Value: cancelledCount },
    { Metric: 'Total Estimated Gross Revenue (₹)', Value: totalRev.toLocaleString('en-IN') },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 35 }, { wch: 35 }];

  // Create Workbook & Append Sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, mainSheet, 'Client Bookings');
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

  const filename = `AURA_Bookings_Audit_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportEquipmentExcel(equipmentList) {
  const data = equipmentList.map((eq, idx) => ({
    '#': idx + 1,
    'Asset Name': eq.name || '',
    'Category': (eq.category || 'camera').toUpperCase(),
    'Operational Status': (eq.status || 'available').toUpperCase(),
    'Assigned Booking': eq.assignedBookingId?.name || (typeof eq.assignedBookingId === 'string' ? eq.assignedBookingId : 'In Vault (Available)'),
    'Assigned Event Date': eq.assignedBookingId?.eventDate || '',
    'Technical Notes / Specs': eq.notes || '',
  }));

  const sheet = XLSX.utils.json_to_sheet(data);
  sheet['!cols'] = [
    { wch: 5 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
    { wch: 32 },
    { wch: 20 },
    { wch: 45 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, 'Equipment Audit');

  const filename = `AURA_Equipment_Inventory_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
