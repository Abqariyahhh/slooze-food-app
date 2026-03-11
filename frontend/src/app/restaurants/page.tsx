'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_RESTAURANTS, CREATE_ORDER, GET_MY_ORDERS } from '@/graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { getAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/currency';
import { toast } from 'sonner';

export default function RestaurantsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => { setUser(getAuth()); }, []);

  const { data, loading } = useQuery(GET_RESTAURANTS);
  const [createOrder] = useMutation(CREATE_ORDER, {
    refetchQueries: [GET_MY_ORDERS],
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [ordering, setOrdering] = useState(false);

  const restaurants = (data as any)?.restaurants || [];

  const addToCart = (itemId: string) =>
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

  const removeFromCart = (itemId: string) =>
    setCart(prev => {
      const next = { ...prev };
      if (next[itemId] > 1) next[itemId]--;
      else delete next[itemId];
      return next;
    });

  const cartTotal = selectedRestaurant?.menuItems?.reduce(
    (sum: number, item: any) => sum + (cart[item.id] || 0) * item.price, 0,
  ) || 0;

  const cartCount = Object.values(cart).reduce((a: number, b: number) => a + b, 0);

  const handleOrder = async () => {
    if (!selectedRestaurant || cartCount === 0) return;
    setOrdering(true);
    try {
      const items = Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
      await createOrder({
        variables: { input: { restaurantId: selectedRestaurant.id, items, notes: notes || undefined } },
      });
      toast.success('Order placed successfully! 🎉');
      setCart({});
      setNotes('');
      setSelectedRestaurant(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOrdering(false);
    }
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-800 rounded-2xl p-6 animate-pulse space-y-4 h-48">
            <div className="h-5 bg-slate-700 rounded w-1/2" />
            <div className="h-3 bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Restaurants</h1>
        <p className="text-slate-400 mt-1" suppressHydrationWarning>
          Showing restaurants in{' '}
          <span className="text-orange-400 font-medium">{user?.country ?? ''}</span>
        </p>
      </div>

      {restaurants.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-white font-medium">No restaurants available</p>
            <p className="text-slate-400 text-sm mt-1">No restaurants found for your region</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((restaurant: any) => (
            <Card
              key={restaurant.id}
              className="bg-slate-800 border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer group"
              onClick={() => { setSelectedRestaurant(restaurant); setCart({}); setNotes(''); }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white group-hover:text-orange-400 transition-colors">
                      {restaurant.name}
                    </CardTitle>
                    <p className="text-slate-400 text-sm mt-1">{restaurant.description}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg shrink-0">
                    <span className="text-green-400 text-sm font-semibold">⭐ {restaurant.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-xs">📍 {restaurant.address}</p>
                  <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                    {restaurant.menuItems?.length} items
                  </Badge>
                </div>
                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                  View Menu & Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Dialog */}
      <Dialog open={!!selectedRestaurant} onOpenChange={() => { setSelectedRestaurant(null); setCart({}); setNotes(''); }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{selectedRestaurant?.name}</DialogTitle>
            <p className="text-slate-400 text-sm">{selectedRestaurant?.description}</p>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {selectedRestaurant?.menuItems?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.description}</p>
                  <p className="text-orange-400 font-semibold mt-1">
                    {formatPrice(item.price, user?.country)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {cart[item.id] ? (
                    <>
                      <button onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center text-sm font-bold">
                        −
                      </button>
                      <span className="text-white w-4 text-center font-semibold">{cart[item.id]}</span>
                      <button onClick={() => addToCart(item.id)}
                        className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                        +
                      </button>
                    </>
                  ) : (
                    <button onClick={() => addToCart(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium">
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes field */}
          {cartCount > 0 && (
            <div className="mt-3">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="📝 Any special instructions? (optional)"
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-orange-500/50"
              />
            </div>
          )}

          {cartCount > 0 && (
            <div className="mt-2 p-4 bg-slate-700 rounded-xl sticky bottom-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                <span className="text-white font-bold text-lg">{formatPrice(cartTotal, user?.country)}</span>
              </div>
              <Button
                onClick={handleOrder}
                disabled={ordering}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                {ordering ? 'Placing Order...' : `Place Order · ${formatPrice(cartTotal, user?.country)}`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
