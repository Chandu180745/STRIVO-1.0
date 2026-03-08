import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Clock, Users, CheckCircle, Flame, Dumbbell, Droplets, Apple, Trophy, BarChart3, Medal } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: typeof Flame;
  duration: string;
  participants: number;
  xpReward: number;
  category: 'workout' | 'nutrition' | 'wellness';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const CHALLENGES: Challenge[] = [
  { id: '30-day-pushup', title: '30 DAY PUSHUP', description: 'Do 100 pushups every day for 30 days', icon: Dumbbell, duration: '30 days', participants: 2847, xpReward: 500, category: 'workout', difficulty: 'Hard' },
  { id: '10k-steps-week', title: '10K STEPS WEEK', description: 'Walk 10,000 steps daily for 7 days', icon: Flame, duration: '7 days', participants: 5231, xpReward: 200, category: 'workout', difficulty: 'Easy' },
  { id: 'hydration-hero', title: 'HYDRATION HERO', description: 'Drink 8 glasses of water daily for 14 days', icon: Droplets, duration: '14 days', participants: 3912, xpReward: 300, category: 'wellness', difficulty: 'Medium' },
  { id: 'clean-eating', title: 'CLEAN EATING', description: 'Log all meals for 21 days straight', icon: Apple, duration: '21 days', participants: 1876, xpReward: 400, category: 'nutrition', difficulty: 'Medium' },
  { id: 'beast-mode', title: 'BEAST MODE', description: 'Complete 5 workouts per week for 4 weeks', icon: Trophy, duration: '28 days', participants: 987, xpReward: 800, category: 'workout', difficulty: 'Hard' },
  { id: 'plank-master', title: 'PLANK MASTER', description: 'Hold plank for 5 minutes by end of 30 days', icon: Dumbbell, duration: '30 days', participants: 1543, xpReward: 350, category: 'workout', difficulty: 'Medium' },
  { id: '60-day-fatloss', title: '60 DAY FAT LOSS', description: 'Follow a calorie-deficit diet and workout plan for 60 days', icon: Flame, duration: '60 days', participants: 4210, xpReward: 1000, category: 'wellness', difficulty: 'Hard' },
];

const GROUPS = [
  { id: 'bodybuilding', name: 'BODYBUILDING', members: 12450, icon: Dumbbell, desc: 'Mass monsters & aesthetics' },
  { id: 'weightloss', name: 'WEIGHT LOSS', members: 18320, icon: Flame, desc: 'Fat loss journeys & support' },
  { id: 'crossfit', name: 'CROSSFIT', members: 6780, icon: Trophy, desc: 'WODs & functional fitness' },
  { id: 'calisthenics', name: 'CALISTHENICS', members: 8940, icon: Medal, desc: 'Bodyweight mastery' },
];

const LEADERBOARD = [
  { rank: 1, name: 'IRON_MAYA', calories: 48200, workouts: 142, streak: 87, avatar: 'M' },
  { rank: 2, name: 'ALEX_FIT', calories: 41800, workouts: 128, streak: 64, avatar: 'A' },
  { rank: 3, name: 'CARDIO_KAI', calories: 39500, workouts: 115, streak: 52, avatar: 'K' },
  { rank: 4, name: 'BEAST_MODE', calories: 35100, workouts: 98, streak: 45, avatar: 'B' },
  { rank: 5, name: 'FIT_NINA', calories: 32400, workouts: 92, streak: 38, avatar: 'N' },
  { rank: 6, name: 'LIFT_HEAVY', calories: 29800, workouts: 85, streak: 31, avatar: 'L' },
  { rank: 7, name: 'YOGA_ZEN', calories: 27200, workouts: 78, streak: 28, avatar: 'Z' },
  { rank: 8, name: 'RUN_FAST', calories: 25600, workouts: 71, streak: 22, avatar: 'R' },
];

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };
const categoryColors = {
  workout: 'border-blue-400/30 bg-blue-400/10 text-blue-400',
  nutrition: 'border-green-400/30 bg-green-400/10 text-green-400',
  wellness: 'border-purple-400/30 bg-purple-400/10 text-purple-400',
};
const diffColors = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' };
const rankColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600'];

type Section = 'challenges' | 'groups' | 'leaderboard';

const Challenges = () => {
  const { activeChallenges, completedChallenges, joinChallenge, completeChallenge, addXP, addBadge, currentStreak, totalWorkoutsLogged } = useSettings();
  const [filter, setFilter] = useState<'all' | 'workout' | 'nutrition' | 'wellness'>('all');
  const [section, setSection] = useState<Section>('challenges');
  const [leaderSort, setLeaderSort] = useState<'calories' | 'workouts' | 'streak'>('calories');

  const filtered = filter === 'all' ? CHALLENGES : CHALLENGES.filter(c => c.category === filter);

  const handleJoin = (c: Challenge) => { joinChallenge(c.id); toast.success(`Joined ${c.title}!`); };
  const handleComplete = (c: Challenge) => {
    completeChallenge(c.id); addXP(c.xpReward);
    if (c.id === 'beast-mode') addBadge('beast-mode');
    toast.success(`+${c.xpReward} XP earned!`);
  };

  const sortedLeaderboard = [...LEADERBOARD].sort((a, b) => b[leaderSort] - a[leaderSort]);

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {([
          { id: 'challenges' as Section, label: 'CHALLENGES', icon: <Swords className="w-3.5 h-3.5" /> },
          { id: 'groups' as Section, label: 'GROUPS', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'leaderboard' as Section, label: 'LEADERBOARD', icon: <BarChart3 className="w-3.5 h-3.5" /> },
        ]).map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.95 }} onClick={() => setSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 font-display text-[10px] tracking-wider border rounded-full whitespace-nowrap transition-all ${
              section === s.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 text-muted-foreground'
            }`}>{s.icon}{s.label}</motion.button>
        ))}
      </div>

      {/* CHALLENGES SECTION */}
      {section === 'challenges' && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['all', 'workout', 'nutrition', 'wellness'] as const).map(f => (
              <motion.button key={f} whileTap={{ scale: 0.9 }} onClick={() => setFilter(f)}
                className={`font-display text-[9px] tracking-wider px-2.5 py-1 border rounded-full whitespace-nowrap transition-all ${
                  filter === f ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/20 text-muted-foreground'
                }`}>{f.toUpperCase()}</motion.button>
            ))}
          </div>

          {activeChallenges.length > 0 && (
            <div>
              <p className="font-display text-xs tracking-wider text-muted-foreground mb-2">ACTIVE ({activeChallenges.length})</p>
              {CHALLENGES.filter(c => activeChallenges.includes(c.id)).map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: i * 0.05 }}
                  className="glass-card mb-2 border-l-2 border-l-strivo-red">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <c.icon className="w-5 h-5 text-strivo-red" />
                      <div>
                        <p className="font-display text-xs tracking-wider">{c.title}</p>
                        <p className="text-[10px] text-muted-foreground">{c.description}</p>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleComplete(c)}
                      className="terminal-button text-[9px] py-1 px-2">
                      <CheckCircle className="w-3 h-3 inline mr-1" />DONE
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {filtered.map((c, i) => {
                const isActive = activeChallenges.includes(c.id);
                const isDone = completedChallenges.includes(c.id);
                return (
                  <motion.div key={c.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                    className={`glass-card ${isDone ? 'opacity-50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
                        <c.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-display text-xs tracking-wider">{c.title}</p>
                          <span className={`text-[8px] font-display ${diffColors[c.difficulty]}`}>{c.difficulty.toUpperCase()}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mb-2">{c.description}</p>
                        <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.participants.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-sm text-yellow-500">+{c.xpReward}</p>
                        <p className="text-[8px] text-muted-foreground font-display">XP</p>
                        {isDone ? (
                          <span className="text-[9px] font-display text-green-400 flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3" />DONE</span>
                        ) : !isActive ? (
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleJoin(c)}
                            className="terminal-button text-[9px] py-1 px-2 mt-1">JOIN</motion.button>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </>
      )}

      {/* GROUPS SECTION */}
      {section === 'groups' && (
        <div className="space-y-3">
          {GROUPS.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className="glass-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0">
                  <g.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-xs tracking-wider">{g.name}</p>
                  <p className="text-[10px] text-muted-foreground">{g.desc}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3" />{g.members.toLocaleString()} members
                  </p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => toast.success(`Joined ${g.name}!`)}
                  className="terminal-button text-[9px] py-1.5 px-3">JOIN</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* LEADERBOARD SECTION */}
      {section === 'leaderboard' && (
        <div className="space-y-3">
          <div className="flex gap-1.5">
            {(['calories', 'workouts', 'streak'] as const).map(s => (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setLeaderSort(s)}
                className={`font-display text-[9px] tracking-wider px-2.5 py-1 border rounded-full transition-all ${
                  leaderSort === s ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 text-muted-foreground'
                }`}>{s.toUpperCase()}</motion.button>
            ))}
          </div>

          {/* Your rank */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card border-l-2 border-l-strivo-red">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm w-6 text-center text-muted-foreground">#9</span>
              <div className="w-8 h-8 rounded-full bg-strivo-red/20 border border-strivo-red/30 flex items-center justify-center font-display text-xs">U</div>
              <div className="flex-1">
                <p className="font-display text-xs tracking-wider">YOU</p>
                <p className="text-[9px] text-muted-foreground">
                  {leaderSort === 'calories' ? '~12,400 kcal' : leaderSort === 'workouts' ? `${totalWorkoutsLogged} workouts` : `${currentStreak} day streak`}
                </p>
              </div>
            </div>
          </motion.div>

          {sortedLeaderboard.map((u, i) => (
            <motion.div key={u.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.04 }}
              className="glass-card">
              <div className="flex items-center gap-3">
                <span className={`font-display text-sm w-6 text-center ${i < 3 ? rankColors[i] : 'text-muted-foreground'}`}>
                  #{u.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center font-display text-xs">
                  {u.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-display text-xs tracking-wider">{u.name}</p>
                  <p className="text-[9px] text-muted-foreground">
                    {leaderSort === 'calories' ? `${u.calories.toLocaleString()} kcal` :
                     leaderSort === 'workouts' ? `${u.workouts} workouts` :
                     `${u.streak} day streak`}
                  </p>
                </div>
                {i === 0 && <Trophy className="w-4 h-4 text-yellow-400" />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;
