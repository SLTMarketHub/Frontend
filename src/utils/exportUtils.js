import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const exportToCSV = (data, filename = 'export', columns = null) => {
  try {
    let exportData = data;

    if (columns && Array.isArray(columns)) {
      exportData = data.map(item => {
        const row = {};
        columns.forEach(col => {
          row[col.label] = item[col.key];
        });
        return row;
      });
    }

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

export const exportToPDF = (data, filename = 'export', options = {}) => {
  try {
    const {
      title = 'Report',
      columns = [],
      orientation = 'portrait',
      includeDate = true,
    } = options;

    const doc = new jsPDF(orientation, 'mm', 'a4');

    let startY = 20;

    doc.setFontSize(18);
    doc.setTextColor(0, 166, 81);
    doc.text(title, 14, startY);

    if (includeDate) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${formatDate(new Date(), 'long')}`, 14, startY + 7);
      startY += 12;
    } else {
      startY += 8;
    }

    let tableColumns = [];
    let tableRows = [];

    if (columns && columns.length > 0) {
      tableColumns = columns.map(col => col.label);
      tableRows = data.map(item => 
        columns.map(col => {
          const value = item[col.key];
          if (col.format === 'currency') return formatCurrency(value);
          if (col.format === 'date') return formatDate(value);
          if (col.format === 'percentage') return `${value}%`;
          return value !== null && value !== undefined ? value.toString() : '';
        })
      );
    } else {
      if (data.length > 0) {
        tableColumns = Object.keys(data[0]);
        tableRows = data.map(item => Object.values(item).map(val => 
          val !== null && val !== undefined ? val.toString() : ''
        ));
      }
    }

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: startY,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 166, 81],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: startY, left: 14, right: 14 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`${filename}_${Date.now()}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

export const exportSalesReportPDF = (reportData, period = 'monthly') => {
  try {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    
    doc.setFontSize(20);
    doc.setTextColor(0, 166, 81);
    doc.text('Sales Report', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`, 14, 28);
    doc.text(`Generated: ${formatDate(new Date(), 'long')}`, 14, 34);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Summary', 14, 45);
    
    const stats = [
      ['Total Revenue', formatCurrency(reportData.totalRevenue || 0)],
      ['Total Orders', (reportData.totalOrders || 0).toString()],
      ['Average Order Value', formatCurrency(reportData.avgOrderValue || 0)],
      ['Growth Rate', `${reportData.growthRate || 0}%`],
    ];
    
    doc.autoTable({
      body: stats,
      startY: 50,
      theme: 'plain',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 'auto' },
      },
    });
    
    if (reportData.topProducts && reportData.topProducts.length > 0) {
      const finalY = doc.lastAutoTable.finalY || 90;
      
      doc.setFontSize(14);
      doc.text('Top Selling Products', 14, finalY + 10);
      
      doc.autoTable({
        head: [['Product', 'Sales', 'Revenue']],
        body: reportData.topProducts.map(p => [
          p.name,
          p.sales.toString(),
          formatCurrency(p.revenue),
        ]),
        startY: finalY + 15,
        theme: 'striped',
        headStyles: {
          fillColor: [0, 166, 81],
        },
      });
    }
    
    doc.save(`sales_report_${period}_${Date.now()}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting sales report:', error);
    return false;
  }
};

export const exportTicketsCSV = (tickets) => {
  const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'customerName', label: 'Customer' },
    { key: 'createdAt', label: 'Created Date' },
    { key: 'updatedAt', label: 'Last Updated' },
  ];
  
  return exportToCSV(tickets, 'support_tickets', columns);
};

export default {
  exportToCSV,
  exportToPDF,
  exportSalesReportPDF,
  exportTicketsCSV,
};