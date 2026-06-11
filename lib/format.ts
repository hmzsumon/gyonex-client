export const formatPrice = (price: number): string => {
  if (!price && price !== 0) return '—';
  if (price >= 1000000) return (price / 1000000).toFixed(2) + 'M';
  if (price >= 1000) return price.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return price.toFixed(8);
};

export const formatVolume = (volume: number): string => {
  if (!volume) return '—';
  if (volume >= 1e12) return (volume / 1e12).toFixed(2) + 'T';
  if (volume >= 1e9)  return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6)  return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3)  return (volume / 1e3).toFixed(2) + 'K';
  return volume.toFixed(2);
};

export const formatChangeRate = (rate: number): string => {
  if (rate === undefined || rate === null) return '—';
  const pct = (rate * 100).toFixed(2);
  return (Number(pct) > 0 ? '+' : '') + pct + '%';
};

export const formatUSD = (amount: number): string => {
  if (!amount && amount !== 0) return '$0.00';
  if (amount >= 1e9) return '$' + (amount / 1e9).toFixed(2) + 'B';
  if (amount >= 1e6) return '$' + (amount / 1e6).toFixed(2) + 'M';
  if (amount >= 1e3) return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + amount.toFixed(2);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
