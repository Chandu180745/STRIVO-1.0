import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Star, ShoppingCart, Truck, Shield, Download } from 'lucide-react';
import { Product } from '@/lib/products';
import { productDetails } from '@/lib/productDetails';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { generatePDF } from '@/lib/pdfExport';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'info' | 'nutrition' | 'ingredients' | 'usage' | 'reviews';

const mockReviews = [
  { user: 'FitGuru99', rating: 5, text: 'Incredible quality! Noticed results within 2 weeks.', date: '2026-01-15' },
  { user: 'GymRat_X', rating: 4, text: 'Good value for money. Fast delivery too.', date: '2026-01-20' },
  { user: 'HealthyLife', rating: 5, text: 'Best purchase I made this year. Highly recommended!', date: '2026-02-01' },
];

const sizeOptions: Record<string, string[]> = {
  supplements: ['250g', '500g', '1kg', '2.5kg'],
  diet: ['Single', 'Pack of 3', 'Pack of 6', 'Weekly Box'],
  equipment: ['Standard', 'Pro', 'Elite'],
};

const flavorOptions = ['Chocolate', 'Vanilla', 'Strawberry', 'Unflavored'];

export const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [zoomed, setZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [subscribeMonthly, setSubscribeMonthly] = useState(false);
  const { addItem } = useCart();

  if (!product) return null;

  const detail = productDetails[product.id];
  const sizes = sizeOptions[product.category] || sizeOptions.equipment;
  const showFlavors = product.category === 'supplements' || product.category === 'diet';

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast.success(`${product.name} added to cart`);
  };

  const handleSubscribe = () => {
    toast.success(`Monthly subscription set for ${product.name}! 10% savings applied.`, { duration: 4000 });
    setSubscribeMonthly(true);
  };

  const handleDownloadPDF = () => {
    if (!detail) return;
    generatePDF(`Product Details — ${product.name}`, [
      { heading: 'Description', content: detail.longDescription },
      { heading: 'Nutritional Breakdown', content: Object.entries(detail.nutritionalBreakdown).map(([k, v]) => `${k}: ${v}`).join('\n') },
      { heading: 'Ingredients', content: detail.ingredients.join(', ') },
      { heading: 'Usage Instructions', content: detail.usage },
    ]);
    toast.success('PDF downloaded');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: 'INFO' },
    { id: 'nutrition', label: 'NUTRITION' },
    { id: 'ingredients', label: 'INGREDIENTS' },
    { id: 'usage', label: 'USAGE' },
    { id: 'reviews', label: 'REVIEWS' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-4 bottom-24 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[95vw] md:max-w-2xl md:max-h-[85vh] overflow-y-auto bg-card border-2 border-foreground/20 z-50 rounded-2xl">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-foreground/20 sticky top-0 bg-card z-10">
              <h2 className="font-display text-sm md:text-lg tracking-wider truncate pr-2">{product.name}</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadPDF} className="p-2 hover:bg-muted rounded-full" title="Download PDF">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Image with zoom */}
              <div className={`relative overflow-hidden border border-foreground/10 cursor-pointer transition-all ${zoomed ? 'h-96' : 'h-48 md:h-56'}`}
                onClick={() => setZoomed(!zoomed)}>
                {product.image && product.image !== '/placeholder.svg' ? (
                  <img src={product.image} alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-muted-foreground/30">
                    {product.category === 'supplements' ? '◎' : product.category === 'diet' ? '🍽' : '⬡'}
                  </div>
                )}
                <div className="absolute top-2 right-2 p-1.5 bg-background/80 border border-foreground/20">
                  {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </div>
              </div>

              {/* Long description */}
              {detail && (
                <p className="text-sm text-muted-foreground leading-relaxed">{detail.longDescription}</p>
              )}

              {/* Size selector */}
              <div>
                <p className="text-[10px] font-display text-muted-foreground mb-2">SIZE / QUANTITY</p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s, i) => (
                    <button key={s} onClick={() => setSelectedSize(i)}
                      className={`px-3 py-1.5 text-xs font-display border-2 transition-colors rounded-full ${
                        selectedSize === i ? 'bg-foreground text-background border-foreground' : 'border-foreground/30'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Flavor selector */}
              {showFlavors && (
                <div>
                  <p className="text-[10px] font-display text-muted-foreground mb-2">FLAVOR</p>
                  <div className="flex gap-2 flex-wrap">
                    {flavorOptions.map((f, i) => (
                      <button key={f} onClick={() => setSelectedFlavor(i)}
                      className={`px-3 py-1.5 text-xs font-display border-2 transition-colors rounded-full ${
                        selectedFlavor === i ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/30'
                      }`}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 border-b border-foreground/10 overflow-x-auto">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-2 md:px-3 py-2 text-[9px] md:text-[10px] font-display tracking-wider transition-colors whitespace-nowrap ${
                      activeTab === tab.id ? 'border-b-2 border-strivo-red text-foreground' : 'text-muted-foreground'
                    }`}>{tab.label}</button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {activeTab === 'info' && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex gap-4 text-xs font-display text-muted-foreground">
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> FREE DELIVERY</span>
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> QUALITY ASSURED</span>
                      </div>
                      {product.tags && (
                        <div className="flex gap-1 flex-wrap">
                          {product.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 text-[9px] font-display border border-foreground/20 rounded-full">{t.toUpperCase()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'nutrition' && detail && (
                    <div className="space-y-2">
                      {product.category === 'equipment' ? (
                        <p className="text-sm text-muted-foreground">Nutritional info not applicable for equipment.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(detail.nutritionalBreakdown).map(([key, val]) => (
                            <div key={key} className="p-2 border border-foreground/10 text-center">
                              <p className="text-[9px] font-display text-muted-foreground uppercase">{key}</p>
                              <p className="font-display text-sm">{val}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'ingredients' && detail && (
                    <div className="space-y-2">
                      <ul className="space-y-1.5">
                        {detail.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-strivo-red font-display mt-0.5">•</span>
                            <span className="text-muted-foreground">{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'usage' && detail && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{detail.usage}</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <span className="text-xs font-display text-muted-foreground">4.7 / 5 ({mockReviews.length} reviews)</span>
                      </div>
                      {mockReviews.map((r, i) => (
                        <div key={i} className="p-3 border border-foreground/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-xs">{r.user}</span>
                            <div className="flex">
                              {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{r.text}</p>
                          <p className="text-[9px] text-muted-foreground">{r.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Price & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                <div>
                  <p className="font-display text-2xl">₹{product.price.toLocaleString()}</p>
                  {subscribeMonthly && <p className="text-[10px] text-green-400 font-display">SUBSCRIBED — 10% OFF MONTHLY</p>}
                </div>
                <div className="flex gap-2">
                  {(product.category === 'supplements' || product.category === 'diet') && !subscribeMonthly && (
                    <button onClick={handleSubscribe}
                      className="terminal-button-outline text-xs py-2 px-3 rounded-full">SUBSCRIBE</button>
                  )}
                  <button onClick={handleAddToCart}
                    className="terminal-button text-xs py-2 px-4 flex items-center gap-2 rounded-full">
                    <ShoppingCart className="w-4 h-4" /> ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
