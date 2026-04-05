/**
 * Export utilities for downloading transaction data as CSV or JSON.
 */

export function exportAsCSV(transactions, filename = 'transactions.csv') {
  if (!transactions.length) return;

  const headers = ['ID', 'Date', 'Title', 'Amount (₹)', 'Category', 'Type'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    `"${t.title}"`,
    t.amount,
    t.category,
    t.type,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csv, filename, 'text/csv');
}

export function exportAsJSON(transactions, filename = 'transactions.json') {
  if (!transactions.length) return;

  const json = JSON.stringify(transactions, null, 2);
  downloadBlob(json, filename, 'application/json');
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
