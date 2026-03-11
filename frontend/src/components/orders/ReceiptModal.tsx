'use client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/currency';

interface Props {
  order: any;
  country?: string;
  open: boolean;
  onClose: () => void;
}

export function ReceiptModal({ order, country, open, onClose }: Props) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🧾 Order Receipt
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Header */}
          <div className="text-center py-3 border-b border-dashed border-slate-600">
            <p className="text-lg font-bold text-white">{order.restaurantName}</p>
            <p className="text-slate-400 text-xs mt-1">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="text-white">{item.menuItemName}</span>
                  <span className="text-slate-400 ml-2">× {item.quantity}</span>
                </div>
                <span className="text-slate-300">
                  {formatPrice(item.price * item.quantity, country)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-dashed border-slate-600 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Total</span>
              <span className="text-orange-400 font-bold text-lg">
                {formatPrice(order.totalAmount, country)}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-center pt-1">
            <Badge
              className={
                order.status === 'CONFIRMED'
                  ? 'bg-green-500/20 text-green-400 border-green-500/30 border'
                  : order.status === 'CANCELLED'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 border'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border'
              }
            >
              {order.status === 'CONFIRMED' ? '✓ Paid & Confirmed' : order.status}
            </Badge>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs">📝 Note: {order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
