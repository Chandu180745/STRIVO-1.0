import { motion } from 'framer-motion';
import { Plus, Eye, Heart, Star } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onViewDetail?: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetail }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast.success(`${product.name} added to cart`, { className: 'font-display' });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', { className: 'font-display' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewDetail?.(product)}
      className="glass-card card-3d border-2 border-foreground/20 group cursor-pointer rounded-3xl"
      style={{ perspective: '800px' }}
    >
      <div className="aspect-square bg-muted/50 border-2 border-foreground/10 mb-3 flex items-center justify-center overflow-hidden rounded-2xl relative">
        {product.image && product.image !== '/placeholder.svg' ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="font-display text-4xl text-muted-foreground/30 group-hover:scale-110 transition-transform">
            {product.category === 'supplements' ? '◎' : product.category === 'diet' ? '🍽' : '⬡'}
          </div>
        )}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-6 h-6" />
        </div>
        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all z-10 ${
            wishlisted ? 'bg-strivo-red text-white' : 'bg-background/80 text-muted-foreground hover:text-strivo-red'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <h3 className="font-display text-sm tracking-wider mb-1 line-clamp-1">{product.name}</h3>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-display text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

      <div className="flex items-center justify-between">
        <span className="font-display text-lg">₹{product.price.toLocaleString()}</span>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="p-2 rounded-full border-2 border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
