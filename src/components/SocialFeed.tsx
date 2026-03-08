import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, Dumbbell, Flame, Trophy, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFitnessData } from '@/hooks/useFitnessData';
import { toast } from 'sonner';

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  type: 'workout' | 'achievement' | 'progress';
  content: string;
  details?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: '1', author: 'ALEX_FIT', avatar: 'A', time: '2h ago', type: 'workout',
    content: 'Crushed leg day! 5x5 squats at 120kg 🔥',
    details: 'SQUATS 5×5 @120kg • LEG PRESS 4×12 @200kg • LUNGES 3×15',
    likes: 24, comments: 5, liked: false,
  },
  {
    id: '2', author: 'IRON_MAYA', avatar: 'M', time: '4h ago', type: 'achievement',
    content: 'NEW PR: Deadlift 180kg! 🏆',
    details: '3 months of grinding finally paid off. Up 20kg from last PR.',
    likes: 89, comments: 12, liked: false,
  },
  {
    id: '3', author: 'CARDIO_KAI', avatar: 'K', time: '6h ago', type: 'progress',
    content: 'Week 8 of cut: Down 4.5kg, strength maintained 💪',
    details: 'BW: 78.5kg → 74kg • BENCH: 100kg (maintained) • WAIST: -3cm',
    likes: 56, comments: 8, liked: false,
  },
  {
    id: '4', author: 'YOGA_ZEN', avatar: 'Z', time: '8h ago', type: 'workout',
    content: 'Morning flow + 5km run. Perfect start to the day ☀️',
    details: '45min VINYASA • 5KM RUN @5:30/km • MEDITATION 10min',
    likes: 31, comments: 3, liked: false,
  },
];

const typeIcons = {
  workout: <Dumbbell className="w-3.5 h-3.5" />,
  achievement: <Trophy className="w-3.5 h-3.5" />,
  progress: <Flame className="w-3.5 h-3.5" />,
};

const typeColors = {
  workout: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  achievement: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  progress: 'text-green-400 border-green-400/30 bg-green-400/10',
};

export const SocialFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const { user } = useAuth();
  const { todayLog } = useFitnessData();
  const today = todayLog();

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const sharePost = () => {
    if (!newPost.trim()) return;
    const post: FeedPost = {
      id: Date.now().toString(),
      author: user?.name?.toUpperCase() || 'YOU',
      avatar: user?.name?.[0]?.toUpperCase() || 'U',
      time: 'Just now',
      type: 'workout',
      content: newPost,
      details: today.steps > 0 ? `STEPS: ${today.steps} • CALORIES: ${today.calories}kcal • WATER: ${today.water} glasses` : undefined,
      likes: 0, comments: 0, liked: false,
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setShowCompose(false);
    toast.success('Posted to feed!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider flex items-center gap-2">
          <Share2 className="w-5 h-5 text-strivo-red" />
          FITNESS FEED
        </h2>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCompose(!showCompose)}
          className="terminal-button text-xs py-1.5 px-3 flex items-center gap-1">
          <Plus className="w-3 h-3" /> POST
        </motion.button>
      </div>

      {/* Compose */}
      <AnimatePresence>
        {showCompose && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card overflow-hidden">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="Share your workout, PR, or progress..."
              className="w-full bg-transparent border border-foreground/20 p-3 text-sm resize-none h-20 focus:outline-none focus:border-foreground/50 font-sans" />
            <div className="flex justify-between items-center mt-2">
              <p className="text-[10px] text-muted-foreground font-display">
                {today.steps > 0 && `📊 Today: ${today.steps} steps, ${today.calories}kcal`}
              </p>
              <motion.button whileTap={{ scale: 0.9 }} onClick={sharePost}
                className="terminal-button text-xs py-1.5 px-4 flex items-center gap-1">
                <Send className="w-3 h-3" /> SHARE
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post, i) => (
          <motion.div key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center font-display text-xs">
                {post.avatar}
              </div>
              <div className="flex-1">
                <p className="font-display text-xs tracking-wider">{post.author}</p>
                <p className="text-[10px] text-muted-foreground">{post.time}</p>
              </div>
              <span className={`text-[9px] font-display px-2 py-0.5 rounded-full border ${typeColors[post.type]} flex items-center gap-1`}>
                {typeIcons[post.type]}
                {post.type.toUpperCase()}
              </span>
            </div>

            {/* Content */}
            <p className="text-sm mb-2">{post.content}</p>
            {post.details && (
              <pre className="text-[10px] font-mono text-muted-foreground bg-muted/30 p-2 border border-foreground/10 mb-3 whitespace-pre-wrap rounded-2xl">
                {post.details}
              </pre>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-foreground/10">
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs ${post.liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
                <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-current' : ''}`} />
                <span className="font-display">{post.likes}</span>
              </motion.button>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-display">{post.comments}</span>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(post.content); toast.success('Copied!'); }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
