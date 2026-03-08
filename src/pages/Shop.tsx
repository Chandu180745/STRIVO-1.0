import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, Pill, UtensilsCrossed, Search, SlidersHorizontal, X, Crown, Star, Zap, ArrowLeftRight, Download, Heart, Layers, RefreshCw } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { AIRecommendations } from '@/components/AIRecommendations';
import { getEquipment, getSupplements, getDietProducts, products, Product, stackRecommendations, getProductById } from '@/lib/products';
import { productDetails } from '@/lib/productDetails';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useNavigate } from 'react-router-dom';
import { exportComparisonReport } from '@/lib/pdfExport';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import type { Language } from '@/lib/i18n';

type Tab = 'equipment' | 'supplements' | 'diet' | 'wishlist' | 'stacks';

const subscriptionPlans = [
  { id: 'pro', name: 'PRO', price: 499, icon: Zap, features: ['5% off all products', 'Priority delivery', 'Basic workout plans'] },
  { id: 'plus', name: 'PLUS', price: 999, icon: Star, features: ['10% off all products', 'Free delivery', 'Advanced plans', 'AI recommendations'] },
  { id: 'premium', name: 'PREMIUM', price: 1999, icon: Crown, features: ['15% off everything', 'Same-day delivery', 'Personal trainer AI', 'Exclusive products', 'Auto-reorder'] },
];

const Shop = () => {
  const [activeTab, setActiveTab] = useState<Tab>('equipment');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [showStacks, setShowStacks] = useState(false);
  const { items, addItem } = useCart();
  const { items: wishlistIds } = useWishlist();
  const navigate = useNavigate();
  const { language } = useSettings();
  const lang = language as Language;
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const currentProducts = useMemo(() => {
    if (activeTab === 'wishlist') {
      let prods = products.filter(p => wishlistIds.includes(p.id));
      if (searchQuery) prods = prods.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return prods;
    }
    if (activeTab === 'stacks') return [];
    let prods = activeTab === 'equipment' ? getEquipment() : activeTab === 'supplements' ? getSupplements() : getDietProducts();
    if (searchQuery) prods = prods.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (priceRange !== 'all') prods = prods.filter(p => { if (priceRange === 'low') return p.price < 1000; if (priceRange === 'mid') return p.price >= 1000 && p.price < 3000; return p.price >= 3000; });
    if (selectedTags.length > 0) prods = prods.filter(p => p.tags?.some(t => selectedTags.includes(t)));
    return prods;
  }, [activeTab, searchQuery, priceRange, selectedTags, wishlistIds]);

  const availableTags = useMemo(() => {
    if (activeTab === 'wishlist' || activeTab === 'stacks') return [];
    const prods = activeTab === 'equipment' ? getEquipment() : activeTab === 'supplements' ? getSupplements() : getDietProducts();
    const tags = new Set<string>();
    prods.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [activeTab]);

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const toggleCompareItem = (product: Product) => {
    setCompareItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  const handleAddStack = (productIds: string[]) => {
    productIds.forEach(id => {
      const p = getProductById(id);
      if (p) addItem({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category });
    });
    toast.success('Stack added to cart!');
  };

  const handleAutoReorder = () => {
    if (items.length === 0) {
      toast.error('No previous orders to reorder');
      return;
    }
    toast.success('Auto-reorder scheduled! Items will be delivered monthly.', { duration: 4000 });
  };

  const tabs = [
    { id: 'equipment' as Tab, icon: Package, label: 'EQUIPMENT' },
    { id: 'supplements' as Tab, icon: Pill, label: 'SUPPLEMENTS' },
    { id: 'diet' as Tab, icon: UtensilsCrossed, label: 'DIET & FOOD' },
    { id: 'stacks' as Tab, icon: Layers, label: 'STACKS' },
    { id: 'wishlist' as Tab, icon: Heart, label: `WISHLIST (${wishlistIds.length})` },
  ];

  return (
    <div className="min-h-screen pb-24 pixel-grid overflow-x-hidden">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-4xl tracking-wider">{t('shop', lang)}</h1>
            <p className="text-muted-foreground text-sm">Gear up for greatness</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAutoReorder}
              className="p-3 border-2 border-foreground/20 hover:border-foreground transition-colors rounded-full" title="Auto Reorder">
              <RefreshCw className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSubscriptions(!showSubscriptions)}
              className={`p-3 border-2 transition-colors rounded-full ${showSubscriptions ? 'border-strivo-red bg-strivo-red/10' : 'border-foreground/20 hover:border-foreground'}`}>
              <Crown className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setCompareMode(!compareMode); setCompareItems([]); }}
              className={`p-3 border-2 transition-colors rounded-full ${compareMode ? 'border-strivo-red bg-strivo-red/10' : 'border-foreground/20 hover:border-foreground'}`}>
              <ArrowLeftRight className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/checkout')}
              className="relative p-3 border-2 border-foreground/20 hover:border-foreground transition-colors rounded-full">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-strivo-red text-white text-xs font-display rounded-full flex items-center justify-center">{cartCount}</span>}
            </motion.button>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <AnimatePresence>
          {showSubscriptions && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="grid md:grid-cols-3 gap-3">
                {subscriptionPlans.map(plan => {
                  const Icon = plan.icon;
                  const isActive = activeSub === plan.id;
                  return (
                    <motion.div key={plan.id} whileHover={{ scale: 1.02, y: -4 }}
                      className={`glass-card card-3d border-2 transition-colors ${isActive ? 'border-strivo-red bg-strivo-red/5' : 'border-foreground/10'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-strivo-red' : ''}`} />
                        <span className="font-display tracking-wider">{plan.name}</span>
                      </div>
                      <p className="font-display text-2xl mb-3">₹{plan.price}<span className="text-xs text-muted-foreground">/mo</span></p>
                      <ul className="space-y-1 mb-4">
                        {plan.features.map((f, i) => (
                          <li key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <span className="text-strivo-red">▸</span> {f}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setActiveSub(isActive ? null : plan.id)}
                        className={`w-full py-2 text-xs font-display tracking-wider border transition-colors rounded-full ${
                          isActive ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/30 hover:border-foreground'
                        }`}>{isActive ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}</button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare Mode Banner */}
        {compareMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 border-2 border-strivo-red/30 bg-strivo-red/5 rounded-2xl">
            <p className="text-xs font-display tracking-wider">{t('compare', lang)} MODE — Select up to 3 products ({compareItems.length}/3)</p>
            {compareItems.length >= 2 && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs font-display">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-2 text-muted-foreground">FEATURE</th>
                      {compareItems.map(p => <th key={p.id} className="text-left py-2 px-2">{p.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-foreground/10"><td className="py-2 px-2 text-muted-foreground">PRICE</td>{compareItems.map(p => <td key={p.id} className="py-2 px-2">₹{p.price.toLocaleString()}</td>)}</tr>
                    <tr className="border-b border-foreground/10"><td className="py-2 px-2 text-muted-foreground">RATING</td>{compareItems.map(p => <td key={p.id} className="py-2 px-2">{p.rating || 'N/A'} ⭐</td>)}</tr>
                    <tr className="border-b border-foreground/10"><td className="py-2 px-2 text-muted-foreground">CATEGORY</td>{compareItems.map(p => <td key={p.id} className="py-2 px-2">{p.category.toUpperCase()}</td>)}</tr>
                    {compareItems.some(p => p.category !== 'equipment') && (
                      <>
                        <tr className="border-b border-foreground/10"><td className="py-2 px-2 text-muted-foreground">PROTEIN</td>{compareItems.map(p => <td key={p.id} className="py-2 px-2">{productDetails[p.id]?.nutritionalBreakdown.protein || 'N/A'}</td>)}</tr>
                        <tr className="border-b border-foreground/10"><td className="py-2 px-2 text-muted-foreground">CALORIES</td>{compareItems.map(p => <td key={p.id} className="py-2 px-2">{productDetails[p.id]?.nutritionalBreakdown.calories || 'N/A'}</td>)}</tr>
                      </>
                    )}
                  </tbody>
                </table>
                <button onClick={() => exportComparisonReport(compareItems)} className="mt-3 terminal-button-outline text-[10px] py-1.5 px-3 flex items-center gap-1">
                  <Download className="w-3 h-3" /> DOWNLOAD PDF
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <motion.button key={tab.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTab(tab.id); setSelectedTags([]); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-3 font-display tracking-wider text-xs border-2 transition-all whitespace-nowrap rounded-full ${
                activeTab === tab.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/30 hover:border-foreground/60'
              }`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Search & Filter (not for stacks) */}
        {activeTab !== 'stacks' && (
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="SEARCH PRODUCTS..." className="terminal-input w-full pl-10 py-2 text-sm" />
            </div>
            {activeTab !== 'wishlist' && (
              <button onClick={() => setShowFilters(!showFilters)} className={`p-3 border-2 transition-colors rounded-full ${showFilters ? 'bg-foreground text-background border-foreground' : 'border-foreground/30 hover:border-foreground'}`}>
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {showFilters && activeTab !== 'wishlist' && activeTab !== 'stacks' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
              <div className="glass-card space-y-3">
                <div>
                  <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">PRICE RANGE</p>
                  <div className="flex gap-2 flex-wrap">
                    {[{ id: 'all' as const, label: 'ALL' }, { id: 'low' as const, label: '< ₹1,000' }, { id: 'mid' as const, label: '₹1,000 - ₹3,000' }, { id: 'high' as const, label: '> ₹3,000' }].map(range => (
                      <button key={range.id} onClick={() => setPriceRange(range.id)}
                        className={`px-3 py-1 text-xs font-display border transition-colors rounded-full ${priceRange === range.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/30 hover:border-foreground'}`}>{range.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">TAGS</p>
                  <div className="flex gap-2 flex-wrap">
                    {availableTags.map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 text-xs font-display border transition-colors rounded-full ${selectedTags.includes(tag) ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/30 hover:border-strivo-red/50'}`}>{tag.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                {(selectedTags.length > 0 || priceRange !== 'all') && (
                  <button onClick={() => { setSelectedTags([]); setPriceRange('all'); }} className="text-xs font-display text-strivo-red flex items-center gap-1"><X className="w-3 h-3" /> CLEAR FILTERS</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stacks Tab */}
        {activeTab === 'stacks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">SMART SUPPLEMENT STACKS — SAVE MORE, TRAIN BETTER</p>
            {stackRecommendations.map((stack, i) => {
              const stackProducts = stack.productIds.map(id => getProductById(id)).filter(Boolean) as Product[];
              const totalPrice = stackProducts.reduce((s, p) => s + p.price, 0);
              const discountedPrice = Math.round(totalPrice * (1 - stack.savings / 100));
              return (
                <motion.div key={stack.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card card-3d border-2 border-foreground/10 hover:border-strivo-red/40 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display tracking-wider text-sm">{stack.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{stack.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-strivo-red/10 text-strivo-red text-[10px] font-display border border-strivo-red/30 rounded-full">
                      SAVE {stack.savings}%
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3 overflow-x-auto">
                    {stackProducts.map(p => (
                      <div key={p.id} className="flex-shrink-0 w-20">
                        <div className="w-20 h-20 border border-foreground/10 overflow-hidden mb-1 rounded-xl">
                          {p.image && p.image !== '/placeholder.svg' ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground/30">◎</div>
                          )}
                        </div>
                        <p className="text-[9px] font-display line-clamp-1">{p.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground line-through text-xs font-display">₹{totalPrice.toLocaleString()}</span>
                      <span className="font-display text-lg ml-2">₹{discountedPrice.toLocaleString()}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddStack(stack.productIds)}
                      className="terminal-button text-xs py-2 px-4">ADD STACK TO CART</motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab !== 'stacks' && (
          <>
            <p className="text-xs font-display tracking-wider text-muted-foreground mb-4">{currentProducts.length} PRODUCT{currentProducts.length !== 1 ? 'S' : ''} FOUND</p>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab + searchQuery + priceRange + selectedTags.join(',')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="relative">
                    {compareMode && (
                      <button onClick={() => toggleCompareItem(product)}
                        className={`absolute top-2 left-2 z-10 w-6 h-6 border-2 flex items-center justify-center text-xs font-display rounded-full ${
                          compareItems.find(p => p.id === product.id) ? 'bg-strivo-red border-strivo-red text-white' : 'border-foreground/40 bg-background/80'
                        }`}>
                        {compareItems.find(p => p.id === product.id) ? '✓' : ''}
                      </button>
                    )}
                    <ProductCard product={product} onViewDetail={setDetailProduct} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {currentProducts.length === 0 && activeTab === 'wishlist' && (
              <div className="text-center py-12 text-muted-foreground font-display tracking-wider">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                YOUR WISHLIST IS EMPTY
              </div>
            )}
            {currentProducts.length === 0 && activeTab !== 'wishlist' && (
              <div className="text-center py-12 text-muted-foreground font-display tracking-wider">NO PRODUCTS MATCH YOUR FILTERS</div>
            )}
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-6 border-2 border-strivo-red/30 bg-strivo-red/5 text-center rounded-2xl">
          <p className="font-display tracking-wider text-lg">USE CODE <span className="text-strivo-red">NEW</span> FOR 5% OFF</p>
          <p className="text-sm text-muted-foreground mt-1">First-time customers only • Earn 1% reward points on every purchase</p>
        </motion.div>

        <AIRecommendations />
      </div>

      <ProductDetailModal product={detailProduct} isOpen={!!detailProduct} onClose={() => setDetailProduct(null)} />
    </div>
  );
};

export default Shop;
