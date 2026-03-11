'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_MY_PAYMENTS,
  ADD_PAYMENT,
  UPDATE_PAYMENT,
  DELETE_PAYMENT,
} from '@/graphql/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const paymentIcons: Record<string, string> = {
  CARD: '💳',
  UPI: '📱',
  WALLET: '👜',
};

const defaultForm = { type: 'CARD', last4: '', nickname: '', isDefault: false };

export default function PaymentsPage() {
  // ✅ Fix hydration — load from localStorage only after mount
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (!auth || auth.role !== 'ADMIN') {
      toast.error('Access denied: Admins only');
      router.push('/dashboard');
      return;
    }
    setUser(auth);
  }, [router]);

  const { data } = useQuery(GET_MY_PAYMENTS);

  const [addPayment] = useMutation(ADD_PAYMENT, {
    update(cache, { data }) {
      const newPayment = (data as any)?.addPayment;
      if (!newPayment) return;
      cache.modify({
        fields: {
          myPayments(existing: readonly any[] = []) {
            return [...existing, newPayment];
          },
        },
      });
    },
  });

  const [updatePayment] = useMutation(UPDATE_PAYMENT, {
    update(cache, { data }) {
      const updated = (data as any)?.updatePayment;
      if (!updated) return;
      cache.modify({
        id: cache.identify({ __typename: 'PaymentMethodType', id: updated.id }),
        fields: {
          nickname: () => updated.nickname,
          isDefault: () => updated.isDefault,
        },
      });
    },
  });

  const [deletePayment] = useMutation(DELETE_PAYMENT, {
    update(cache, _result, { variables }) {
      const deletedId = variables?.id;
      if (!deletedId) return;
      cache.modify({
        fields: {
          myPayments(existing: readonly any[], { readField }) {
            return existing.filter(p => readField('id', p) !== deletedId);
          },
        },
      });
    },
  });

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState({ nickname: '', isDefault: false });

  const payments = (data as any)?.myPayments || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPayment({ variables: { input: form } });
      toast.success('Payment method added!');
      setAddOpen(false);
      setForm(defaultForm);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePayment({ variables: { id: editTarget.id, input: editForm } });
      toast.success('Payment method updated!');
      setEditTarget(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePayment({ variables: { id } });
      toast.success('Payment method removed');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEdit = (payment: any) => {
    setEditTarget(payment);
    setEditForm({ nickname: payment.nickname || '', isDefault: payment.isDefault });
  };

  // Don't render until user is confirmed as ADMIN
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
          <p className="text-slate-400 mt-1">Manage your payment options (Admin only)</p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          + Add Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.map((payment: any) => (
          <Card key={payment.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{paymentIcons[payment.type]}</span>
                  <div>
                    <p className="text-white font-medium">
                      {payment.nickname || payment.type}
                    </p>
                    <p className="text-slate-400 text-sm">•••• {payment.last4}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{payment.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {payment.isDefault && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs">
                      Default
                    </Badge>
                  )}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white hover:bg-slate-700 text-xs"
                      onClick={() => openEdit(payment)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                      onClick={() => handleDelete(payment.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {payments.length === 0 && (
          <Card className="col-span-2 bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <p className="text-4xl mb-4">💳</p>
              <p className="text-white">No payment methods added</p>
              <p className="text-slate-400 text-sm mt-1">
                Click &quot;+ Add Payment&quot; to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Type</Label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="CARD">💳 Card</option>
                <option value="UPI">📱 UPI</option>
                <option value="WALLET">👜 Wallet</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Last 4 digits / ID</Label>
              <Input
                value={form.last4}
                onChange={e => setForm({ ...form, last4: e.target.value })}
                placeholder="4242"
                maxLength={4}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Nickname (optional)</Label>
              <Input
                value={form.nickname}
                onChange={e => setForm({ ...form, nickname: e.target.value })}
                placeholder="My Visa Card"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="default"
                checked={form.isDefault}
                onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="default" className="text-slate-300 cursor-pointer">
                Set as default
              </Label>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Add Payment Method
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Nickname</Label>
              <Input
                value={editForm.nickname}
                onChange={e => setEditForm({ ...editForm, nickname: e.target.value })}
                placeholder="My Visa Card"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editDefault"
                checked={editForm.isDefault}
                onChange={e => setEditForm({ ...editForm, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="editDefault" className="text-slate-300 cursor-pointer">
                Set as default
              </Label>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
