import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

type Category = 'nutrition' | 'diet' | 'workouts';

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
  category: Category;
}

const videos: Video[] = [
  // Nutrition
  { id: '1', title: 'Complete Guide to Macronutrients', channel: 'Jeff Nippard', thumbnail: 'https://img.youtube.com/vi/0gNY9AERC3o/mqdefault.jpg', url: 'https://youtube.com/watch?v=0gNY9AERC3o', category: 'nutrition' },
  { id: '2', title: 'How to Build Your Meal Plan', channel: 'Jeremy Ethier', thumbnail: 'https://img.youtube.com/vi/ykCoj4ByiAc/mqdefault.jpg', url: 'https://youtube.com/watch?v=ykCoj4ByiAc', category: 'nutrition' },
  { id: '3', title: 'Supplements That Actually Work', channel: 'Jeff Nippard', thumbnail: 'https://img.youtube.com/vi/M8GpxQvrtqE/mqdefault.jpg', url: 'https://youtube.com/watch?v=M8GpxQvrtqE', category: 'nutrition' },
  { id: '4', title: 'Post-Workout Nutrition Tips', channel: 'Athlean-X', thumbnail: 'https://img.youtube.com/vi/LkXwfnQVMVk/mqdefault.jpg', url: 'https://youtube.com/watch?v=LkXwfnQVMVk', category: 'nutrition' },
  // Diet
  { id: '5', title: 'Indian Vegetarian High Protein Diet', channel: 'FitTuber', thumbnail: 'https://img.youtube.com/vi/TOv8V-xyFns/mqdefault.jpg', url: 'https://youtube.com/watch?v=TOv8V-xyFns', category: 'diet' },
  { id: '6', title: 'Full Day Meal Prep Under Budget', channel: 'BeerBiceps', thumbnail: 'https://img.youtube.com/vi/R7p-2cFaZZg/mqdefault.jpg', url: 'https://youtube.com/watch?v=R7p-2cFaZZg', category: 'diet' },
  { id: '7', title: 'Cutting Diet Plan for Fat Loss', channel: 'Jeremy Ethier', thumbnail: 'https://img.youtube.com/vi/d8V9GwkNbSA/mqdefault.jpg', url: 'https://youtube.com/watch?v=d8V9GwkNbSA', category: 'diet' },
  { id: '8', title: 'Bulking on a Budget', channel: 'Will Tennyson', thumbnail: 'https://img.youtube.com/vi/1xhfc5Qo_gQ/mqdefault.jpg', url: 'https://youtube.com/watch?v=1xhfc5Qo_gQ', category: 'diet' },
  // Workouts
  { id: '9', title: 'Push Pull Legs Routine', channel: 'Jeff Nippard', thumbnail: 'https://img.youtube.com/vi/qVek72z3F1U/mqdefault.jpg', url: 'https://youtube.com/watch?v=qVek72z3F1U', category: 'workouts' },
  { id: '10', title: 'Best Science-Based Full Body Workout', channel: 'Jeremy Ethier', thumbnail: 'https://img.youtube.com/vi/R6gZoAzAhCg/mqdefault.jpg', url: 'https://youtube.com/watch?v=R6gZoAzAhCg', category: 'workouts' },
  { id: '11', title: '20 Min HIIT Workout at Home', channel: 'THENX', thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/mqdefault.jpg', url: 'https://youtube.com/watch?v=ml6cT4AZdqI', category: 'workouts' },
  { id: '12', title: 'Complete Beginner Gym Guide', channel: 'Noel Deyzel', thumbnail: 'https://img.youtube.com/vi/ixkQaZXVQjs/mqdefault.jpg', url: 'https://youtube.com/watch?v=ixkQaZXVQjs', category: 'workouts' },
];

const categories: { id: Category; label: string }[] = [
  { id: 'nutrition', label: '🥗 NUTRITION' },
  { id: 'diet', label: '🍽 DIET PLANS' },
  { id: 'workouts', label: '💪 WORKOUTS' },
];

export const YouTubeSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('nutrition');
  const filtered = videos.filter(v => v.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <h3 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2">
        <Play className="w-5 h-5 text-strivo-red" /> VIDEO GUIDES
      </h3>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-display tracking-wider whitespace-nowrap border transition-colors rounded-full ${
              activeCategory === cat.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/30 hover:border-foreground/60'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((video, i) => (
          <motion.a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group border border-foreground/10 hover:border-foreground/30 transition-all overflow-hidden rounded-2xl">
            <div className="relative aspect-video bg-muted overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-8 h-8" />
              </div>
            </div>
            <div className="p-2">
              <p className="font-display text-xs tracking-wider truncate">{video.title.toUpperCase()}</p>
              <p className="text-[10px] text-muted-foreground">{video.channel}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};
