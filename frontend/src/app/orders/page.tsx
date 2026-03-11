'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_ORDERS, CHECKOUT_ORDER, CANCEL_ORDER } from '@/graphql/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/currency';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
          ✕ Order Cancelled
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 mt-3">
      {statusSteps.map((step, i) => {
        const isActive = status === step;
        const isDone = statusSteps.indexOf(status) > i;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
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
              <span className="text-slate-600">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

type FilterType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<any>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  const { data, loading } = useQuery(GET_MY_ORDERS);

  const [checkoutOrder] = useMutation(CHECKOUT_ORDER, {
    update(cache, { data }) {
      const updated = (data as any)?.checkoutOrder;
      if (!updated) return;
      cache.modify({
        id: cache.identify({ __typename: 'OrderType', id: updated.id }),
        fields: { status: () => updated.status },
      });
    },
  });

  const [cancelOrder] = useMutation(CANCEL_ORDER, {
    update(cache, { data }) {
      const updated = (data as any)?.cancelOrder;
      if (!updated) return;
      cache.modify({
        id: cache.identify({ __typename: 'OrderType', id: updated.id }),
        fields: { status: () => updated.status },
      });
    },
  });

  const orders = (data as any)?.myOrders || [];
  const filtered = filter === 'ALL' ? orders : orders.filter((o: any) => o.status === filter);
  const canCheckout = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleCheckout = async (orderId: string) => {
    try {
      await checkoutOrder({ variables: { orderId } });
      toast.success('Order confirmed! ✅');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelOrder({ variables: { orderId: cancelTarget } });
      toast.success('Order cancelled');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCancelTarget(null);
    }
  };

  const filterButtons: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'ALL', count: orders.length },
    { label: 'Pending', value: 'PENDING', count: orders.filter((o: any) => o.status === 'PENDING').length },
    { label: 'Confirmed', value: 'CONFIRMED', count: orders.filter((o: any) => o.status === 'CONFIRMED').length },
    { label: 'Cancelled', value: 'CANCELLED', count: orders.filter((o: any) => o.status === 'CANCELLED').length },
  ];

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-800 rounded-xl p-6 animate-pulse space-y-3">
            <div className="h-4 bg-slate-700 rounded w-1/3" />
            <div className="h-3 bg-slate-700 rounded w-1/2" />
            <div className="h-3 bg-slate-700 rounded w-1/4" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="text-slate-400 mt-1">
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
        {orders.filter((o: any) => o.status === 'PENDING').length > 0 && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium">
            ⏳ {orders.filter((o: any) => o.status === 'PENDING').length} pending
          </span>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === btn.value
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            {btn.label}
            <span className={`ml-1.5 text-xs ${filter === btn.value ? 'text-orange-200' : 'text-slate-500'}`}>
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-white font-medium">
              {filter === 'ALL' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {filter === 'ALL' ? 'Go to Restaurants to place your first order' : 'Try a different filter'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order: any) => (
            <Card
              key={order.id}
              className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="cursor-pointer"
                    onClick={() => setReceiptOrder(order)}
                  >
                    <h3 className="text-white font-semibold text-lg hover:text-orange-400 transition-colors">
                      {order.restaurantName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      #{order.id.slice(-8).toUpperCase()} · Click to view receipt
                    </p>
                    <OrderTimeline status={order.status} />
                  </div>
                  <Badge className={`${statusColor[order.status]} border text-xs`}>
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-1 mb-4 p-3 bg-slate-700/30 rounded-lg">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {item.menuItemName} × {item.quantity}
                      </span>
                      <span className="text-slate-400">
                        {formatPrice(item.price * item.quantity, user?.country)}
                      </span>
                    </div>
                  ))}
                  {order.notes && (
                    <p className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-700">
                      📝 {order.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="text-white font-bold">
                    Total: {formatPrice(order.totalAmount, user?.country)}
                  </span>
                  {order.status === 'PENDING' && canCheckout && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => setCancelTarget(order.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleCheckout(order.id)}
                      >
                        Checkout ✓
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Order?"
        description="This action cannot be undone. The order will be permanently cancelled."
        confirmLabel="Yes, Cancel Order"
        cancelLabel="Keep Order"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        country={user?.country}
        open={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
