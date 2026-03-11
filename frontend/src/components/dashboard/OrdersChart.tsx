'use client';

interface Props {
  orders: any[];
}

export function OrdersChart({ orders }: Props) {
  const stats = {
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    CONFIRMED: orders.filter(o => o.status === 'CONFIRMED').length,
    CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
  };
  const max = Math.max(...Object.values(stats), 1);

  const bars = [
    { label: 'Pending', value: stats.PENDING, color: 'bg-yellow-500', text: 'text-yellow-400' },
    { label: 'Confirmed', value: stats.CONFIRMED, color: 'bg-green-500', text: 'text-green-400' },
    { label: 'Cancelled', value: stats.CANCELLED, color: 'bg-red-500', text: 'text-red-400' },
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-6">Order Breakdown</h3>
      <div className="flex items-end justify-around gap-4 h-32">
        {bars.map(bar => (
          <div key={bar.label} className="flex flex-col items-center gap-2 flex-1">
            <span className={`text-sm font-bold ${bar.text}`}>{bar.value}</span>
            <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
              <div
                className={`w-full rounded-t-lg ${bar.color} transition-all duration-700`}
                style={{
                  height: bar.value === 0 ? '4px' : `${(bar.value / max) * 80}px`,
                  opacity: bar.value === 0 ? 0.3 : 1,
                }}
              />
            </div>
            <span className="text-slate-400 text-xs">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
