'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { getAuth } from '@/lib/auth';
import { GET_MY_ORDERS, GET_RESTAURANTS } from '@/graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/currency';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { ReceiptModal } from '@/components/orders/ReceiptModal';

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusSteps = ['PENDING', 'CONFIRMED'];

function OrderTimeline({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
          ✕ Cancelled
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 mt-2">
      {statusSteps.map((step, i) => {
        const isActive = status === step;
        const isDone = statusSteps.indexOf(status) > i;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`text-xs px-2 py-0.5 rounded-full border ${
                isActive
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold'
                  : isDone
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-slate-700 text-slate-500 border-slate-600'
              }`}
            >
              {isDone ? '✓ ' : ''}{step}
            </div>
            {i < statusSteps.length - 1 && (
              <span className="text-slate-600 text-xs">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  const { data: ordersData } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // ✅ auto-refresh every 30s
  });
  const { data: restaurantsData } = useQuery(GET_RESTAURANTS);

  const orders = (ordersData as any)?.myOrders || [];
  const restaurants = (restaurantsData as any)?.restaurants || [];
  const pending = orders.filter((o: any) => o.status === 'PENDING').length;
  const totalSpent = orders
    .filter((o: any) => o.status === 'CONFIRMED')
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" suppressHydrationWarning>
          Welcome back, {user?.firstName ?? ''} 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s what&apos;s happening with your orders today.
          <span className="text-slate-600 text-xs ml-2">
            Press <kbd className="bg-slate-700 text-slate-300 px-1 rounded text-xs">?</kbd> for shortcuts
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Available Restaurants', value: restaurants.length, icon: '🍴', color: 'text-orange-400' },
          { label: 'Total Orders', value: orders.length, icon: '📦', color: 'text-blue-400' },
          { label: 'Pending Orders', value: pending, icon: '⏳', color: 'text-yellow-400' },
          { label: 'Total Spent', value: formatPrice(totalSpent, user?.country), icon: '💰', color: 'text-green-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent Orders side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="md:col-span-1">
          <OrdersChart orders={orders} />
        </div>

        {/* Recent Orders */}
        <Card className="bg-slate-800 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Recent Orders
              <span className="text-xs text-slate-500 font-normal">
                Click an order to view receipt
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No orders yet. Start by browsing restaurants!
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-start justify-between p-4 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{order.restaurantName}</p>
                      <p className="text-slate-400 text-sm">
                        {order.items?.length} items ·{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <OrderTimeline status={order.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-white font-semibold">
                        {formatPrice(order.totalAmount, user?.country)}
                      </span>
                      <Badge className={`${statusColor[order.status]} border text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={selectedOrder}
        country={user?.country}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
