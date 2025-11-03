export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return '-';
  }
  try {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `LKR ${Number(amount).toFixed(2)}`;
  }
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return new Intl.NumberFormat('en').format(Number(value));
}

export function formatPercentage(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return `${Number(value).toFixed(1)}%`;
}

export function formatDate(dateLike, options) {
  if (!dateLike) return '-';
  try {
    const date = new Date(dateLike);
    const fmt = new Intl.DateTimeFormat('en', options || {
      year: 'numeric', month: 'short', day: '2-digit'
    });
    return fmt.format(date);
  } catch {
    return String(dateLike);
  }
}

// Returns Tailwind badge classes based on common status values
export function getStatusColor(status) {
  if (!status) return 'bg-gray-100 text-gray-800';
  const s = String(status).toLowerCase();
  if (['active', 'paid', 'completed', 'delivered', 'confirmed', 'success'].includes(s)) {
    return 'bg-green-100 text-green-800';
  }
  if (['pending', 'processing', 'in_progress', 'warning'].includes(s)) {
    return 'bg-yellow-100 text-yellow-800';
  }
  if (['shipped', 'info'].includes(s)) {
    return 'bg-blue-100 text-blue-800';
  }
  if (['failed', 'cancelled', 'inactive', 'error', 'out_of_stock'].includes(s)) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
}


