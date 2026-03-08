import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Edit2, Save, ChevronRight, X, Package, Trash2, Calendar, Ruler, Weight, Route, Zap, Watch, Smartphone, Camera, Globe, Bell, BellOff, Eye, EyeOff, LayoutDashboard, Shield, Target, ImageOff, Crown, Pill, Star, Heart, MessageSquare, Dumbbell, Moon, Sun, Volume2, VolumeX, Vibrate } from 'lucide-react';
import { BodyTracker } from '@/components/BodyTracker';
import { useAuth } from '@/hooks/useAuth';
import { useSettings, type Gender, type FitnessGoal, type Language, type PrivacySetting, type ExperienceLevel, type WorkoutStyle } from '@/hooks/useSettings';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StreaksAndBadges } from '@/components/StreaksAndBadges';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const genderOptions: { id: Gender; label: string }[] = [
  { id: 'male', label: 'MALE' },
  { id: 'female', label: 'FEMALE' },
  { id: 'other', label: 'OTHER' },
];

const goalOptions: { id: FitnessGoal; label: string }[] = [
  { id: 'lose-weight', label: 'LOSE WEIGHT' },
  { id: 'build-muscle', label: 'BUILD MUSCLE' },
  { id: 'stay-fit', label: 'STAY FIT' },
  { id: 'gain-weight', label: 'GAIN WEIGHT' },
  { id: 'improve-endurance', label: 'ENDURANCE' },
];

const langOptions: { id: Language; label: string }[] = [
  { id: 'en', label: 'ENGLISH' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'ta', label: 'தமிழ்' },
  { id: 'te', label: 'తెలుగు' },
  { id: 'kn', label: 'ಕನ್ನಡ' },
  { id: 'ml', label: 'മലയാളം' },
];

const privacyLabels: Record<PrivacySetting, string> = { public: 'PUBLIC', friends: 'FRIENDS', private: 'PRIVATE' };

const experienceLevels: { id: ExperienceLevel; label: string }[] = [
  { id: 'beginner', label: 'BEGINNER' },
  { id: 'intermediate', label: 'INTERMEDIATE' },
  { id: 'advanced', label: 'ADVANCED' },
];

const workoutStyles: { id: WorkoutStyle; label: string }[] = [
  { id: 'gym', label: '🏋️ GYM' },
  { id: 'home', label: '🏠 HOME' },
  { id: 'yoga', label: '🧘 YOGA' },
  { id: 'crossfit', label: '💪 CROSSFIT' },
];

type SettingsSection = 'theme' | 'profile' | 'units' | 'privacy' | 'notifications' | 'dashboard' | 'devices' | 'language' | 'data' | 'accessibility' | null;

const Profile = () => {
  const { user, isAuthenticated, logout, updateName } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [showSettings, setShowSettings] = useState(false);
  const [openSection, setOpenSection] = useState<SettingsSection>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleLogout = async () => { await logout(); toast.success('Logged out'); navigate('/auth'); };
  const handleSaveName = async () => { if (newName.trim()) { await updateName(newName.trim()); setIsEditing(false); toast.success('Name updated'); } };
  const handleDeleteData = () => { settings.clearAllData(); setShowDeleteConfirm(false); toast.success('All data cleared'); window.location.reload(); };
  const handleGoogleFitToggle = () => { settings.setGoogleFitConnected(!settings.googleFitConnected); toast.success(settings.googleFitConnected ? 'Disconnected' : 'Connected to Google Fit'); };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) { toast.error('Please select a rating'); return; }
    setFeedbackSending(true);
    try {
      await supabase.functions.invoke('send-feedback', {
        body: { rating: feedbackRating, feedback: feedbackText },
      });
      setFeedbackSent(true);
      toast.success('Thank you for your feedback! ❤️');
    } catch {
      toast.error('Failed to send feedback');
    } finally {
      setFeedbackSending(false);
    }
  };
  const toggleSection = (s: SettingsSection) => setOpenSection(prev => prev === s ? null : s);
  
  const handleProfilePicChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => { settings.setProfilePicture(ev.target?.result as string); toast.success('Profile picture updated'); };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveProfilePic = (e: React.MouseEvent) => {
    e.stopPropagation();
    settings.setProfilePicture('');
    toast.success('Profile picture removed');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-24 pixel-grid flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card text-center max-w-md mx-auto">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-display text-2xl tracking-wider mb-2">NOT LOGGED IN</h2>
          <p className="text-muted-foreground mb-6">Sign in to access your profile.</p>
          <button onClick={() => navigate('/auth')} className="terminal-button">LOGIN / SIGNUP</button>
        </motion.div>
      </div>
    );
  }

  const SectionButton = ({ id, icon: Icon, label }: { id: SettingsSection; icon: any; label: string }) => (
    <button onClick={() => toggleSection(id)} className={`w-full flex items-center justify-between py-2.5 px-3 text-xs font-display tracking-wider border transition-colors ${
      openSection === id ? 'border-strivo-red/40 bg-strivo-red/5' : 'border-foreground/10 hover:border-foreground/30'
    }`}>
      <span className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" /> {label}</span>
      <motion.div animate={{ rotate: openSection === id ? 90 : 0 }}><ChevronRight className="w-3.5 h-3.5" /></motion.div>
    </button>
  );

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl tracking-wider">PROFILE</h1>
          <p className="text-muted-foreground text-sm">Your account & settings</p>
        </motion.div>

        {/* User Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card mb-6">
          <div className="flex items-start gap-4">
            <div className="relative group">
              <div className="cursor-pointer" onClick={handleProfilePicChange}>
                {settings.profilePicture ? (
                  <img src={settings.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-strivo-red/30" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-strivo-red/10 border-2 border-strivo-red/30 flex items-center justify-center font-display text-3xl text-strivo-red">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              {settings.profilePicture && (
                <button onClick={handleRemoveProfilePic} className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Remove photo">
                  <ImageOff className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="terminal-input flex-1 py-1" autoFocus />
                  <button onClick={handleSaveName} className="p-2 border border-foreground/30 hover:bg-muted rounded-full"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setIsEditing(false)} className="p-2 border border-foreground/30 hover:bg-muted rounded-full"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl tracking-wider">{user?.name}</h2>
                  <button onClick={() => { setNewName(user?.name || ''); setIsEditing(true); }} className="p-1 hover:bg-muted rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-display bg-muted border border-foreground/10">{settings.gender.toUpperCase()}</span>
                <span className="px-2 py-0.5 text-[10px] font-display bg-strivo-red/10 border border-strivo-red/20 text-strivo-red">{goalOptions.find(g => g.id === settings.fitnessGoal)?.label}</span>
                {settings.rewardPoints > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-display bg-yellow-500/10 border border-yellow-500/30 text-yellow-500">🏆 {settings.rewardPoints} PTS</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-2 mb-4">
          <Link to="/orders" className="w-full glass-card flex items-center justify-between group hover:border-foreground/30 transition-colors">
            <div className="flex items-center gap-3"><Package className="w-5 h-5" /><span className="font-display tracking-wider">ORDER HISTORY</span></div>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Body Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-4">
          <BodyTracker />
        </motion.div>

        {/* Subscription Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }} className="glass-card mb-4 card-3d">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-strivo-red" />
              <div>
                <span className="font-display tracking-wider text-sm">{settings.subscriptionPlan.toUpperCase()} PLAN</span>
                <p className="text-[10px] text-muted-foreground">
                  {settings.subscriptionPlan === 'free' ? 'Upgrade for premium features' : 'All features unlocked'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {(['free', 'premium', 'pro'] as const).map(plan => (
                <button key={plan} onClick={() => settings.setSubscriptionPlan(plan)}
                  className={`px-2 py-1 text-[9px] font-display tracking-wider border transition-colors ${
                    settings.subscriptionPlan === plan ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/20 hover:border-foreground/40'
                  }`}>{plan.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Streaks & Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
          <StreaksAndBadges />
        </motion.div>

        {/* Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-2">
          <button onClick={() => setShowSettings(!showSettings)} className="w-full glass-card flex items-center justify-between group hover:border-foreground/30 transition-colors">
            <div className="flex items-center gap-3"><Settings className="w-5 h-5" /><span className="font-display tracking-wider">SETTINGS</span></div>
            <motion.div animate={{ rotate: showSettings ? 90 : 0 }}><ChevronRight className="w-5 h-5" /></motion.div>
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="glass-card space-y-2 border-l-2 border-strivo-red ml-4">
                  {/* Theme */}
                  <SectionButton id="theme" icon={Eye} label="COLOR THEME" />
                  <AnimatePresence>{openSection === 'theme' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2">
                      <ThemeToggle />
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Profile Settings */}
                  <SectionButton id="profile" icon={User} label="PROFILE DETAILS" />
                  <AnimatePresence>{openSection === 'profile' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 space-y-3 py-2">
                      <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground">GENDER</label>
                        <div className="flex gap-2 mt-1">
                          {genderOptions.map(g => (
                            <button key={g.id} onClick={() => { settings.setGender(g.id); toast.success(`Gender set to ${g.label}`); }}
                              className={`flex-1 py-2 text-xs font-display tracking-wider border transition-colors ${
                                settings.gender === g.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground/40'
                              }`}>{g.label}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-display tracking-wider text-muted-foreground flex items-center gap-1"><Ruler className="w-3 h-3" /> HEIGHT ({settings.heightUnit})</label>
                          <input type="text" value={settings.height} onChange={e => settings.setHeight(e.target.value)} placeholder={settings.heightUnit === 'cm' ? '175' : `5'11"`} className="terminal-input w-full mt-1 text-sm py-2" />
                        </div>
                        <div>
                          <label className="text-[10px] font-display tracking-wider text-muted-foreground flex items-center gap-1"><Weight className="w-3 h-3" /> WEIGHT ({settings.weightUnit})</label>
                          <input type="text" value={settings.weight} onChange={e => settings.setWeight(e.target.value)} placeholder={settings.weightUnit === 'kg' ? '70' : '154'} className="terminal-input w-full mt-1 text-sm py-2" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" /> FITNESS GOAL</label>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {goalOptions.map(g => (
                            <button key={g.id} onClick={() => { settings.setFitnessGoal(g.id); toast.success(`Goal: ${g.label}`); }}
                              className={`px-2 py-1.5 text-[10px] font-display tracking-wider rounded-full border transition-colors ${
                                settings.fitnessGoal === g.id ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/20 hover:border-foreground/40'
                              }`}>{g.label}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground flex items-center gap-1"><Dumbbell className="w-3 h-3" /> EXPERIENCE LEVEL</label>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {experienceLevels.map(l => (
                            <button key={l.id} onClick={() => { settings.setExperienceLevel(l.id); toast.success(`Level: ${l.label}`); }}
                              className={`px-3 py-1.5 text-[10px] font-display tracking-wider rounded-full border transition-colors ${
                                settings.experienceLevel === l.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground/40'
                              }`}>{l.label}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-display tracking-wider text-muted-foreground flex items-center gap-1"><Heart className="w-3 h-3" /> WORKOUT STYLE</label>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {workoutStyles.map(s => {
                            const isActive = settings.preferredWorkoutStyles.includes(s.id);
                            return (
                              <button key={s.id} onClick={() => {
                                const newStyles = isActive
                                  ? settings.preferredWorkoutStyles.filter(st => st !== s.id)
                                  : [...settings.preferredWorkoutStyles, s.id];
                                settings.setPreferredWorkoutStyles(newStyles);
                                toast.success(isActive ? `Removed ${s.label}` : `Added ${s.label}`);
                              }}
                                className={`px-3 py-1.5 text-[10px] font-display tracking-wider rounded-full border transition-colors ${
                                  isActive ? 'bg-strivo-red/20 border-strivo-red/50 text-strivo-red' : 'border-foreground/20 hover:border-foreground/40'
                                }`}>{s.label}</button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-display tracking-wider text-muted-foreground">AGE</label>
                          <input type="text" value={settings.age} onChange={e => settings.setAge(e.target.value)} placeholder="25" className="terminal-input w-full mt-1 text-sm py-2 rounded-full" />
                        </div>
                        <div>
                          <label className="text-[10px] font-display tracking-wider text-muted-foreground">BODY FAT %</label>
                          <input type="text" value={settings.bodyFatPercentage} onChange={e => settings.setBodyFatPercentage(e.target.value)} placeholder="15" className="terminal-input w-full mt-1 text-sm py-2 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Units */}
                  <SectionButton id="units" icon={Ruler} label="UNIT PREFERENCES" />
                  <AnimatePresence>{openSection === 'units' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2">
                      <div className="grid grid-cols-2 gap-3">
                      {([
                          { label: 'HEIGHT', icon: Ruler, value: settings.heightUnit, setter: (v: string) => settings.setHeightUnit(v as any), opts: [{ v: 'cm', l: 'Centimeters (cm)' }, { v: 'ft/in', l: 'Feet & Inches' }] },
                          { label: 'WEIGHT', icon: Weight, value: settings.weightUnit, setter: (v: string) => settings.setWeightUnit(v as any), opts: [{ v: 'kg', l: 'Kilograms (kg)' }, { v: 'lbs', l: 'Pounds (lbs)' }] },
                          { label: 'DISTANCE', icon: Route, value: settings.distanceUnit, setter: (v: string) => settings.setDistanceUnit(v as any), opts: [{ v: 'km', l: 'Kilometers (km)' }, { v: 'miles', l: 'Miles' }] },
                          { label: 'ENERGY', icon: Zap, value: settings.energyUnit, setter: (v: string) => settings.setEnergyUnit(v as any), opts: [{ v: 'kcal', l: 'Calories (kcal)' }, { v: 'kJ', l: 'Kilojoules (kJ)' }] },
                        ]).map(({ label, icon: Icon, value, setter, opts }) => (
                          <div key={label}>
                            <label className="text-[10px] font-display tracking-wider text-muted-foreground flex items-center gap-1 mb-1"><Icon className="w-3 h-3" /> {label}</label>
                            <Select value={value} onValueChange={(v) => setter(v as any)}>
                              <SelectTrigger className="h-8 text-xs bg-muted/30 border-foreground/20"><SelectValue /></SelectTrigger>
                              <SelectContent>{opts.map(o => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                      {/* Week Start */}
                      <div className="mt-3">
                        <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> START OF WEEK</p>
                        <div className="flex gap-2">
                          {(['sunday', 'monday'] as const).map(day => (
                            <button key={day} onClick={() => { settings.setWeekStart(day); toast.success(`Week starts on ${day}`); }}
                              className={`flex-1 py-2 text-xs font-display tracking-wider border transition-colors ${
                                settings.weekStart === day ? 'bg-foreground text-background border-foreground' : 'bg-muted/30 border-foreground/20 hover:border-foreground/40'
                              }`}>{day.toUpperCase()}</button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Privacy */}
                  <SectionButton id="privacy" icon={Shield} label="PRIVACY" />
                  <AnimatePresence>{openSection === 'privacy' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2 space-y-3">
                      {([
                        { label: 'PROFILE VISIBILITY', value: settings.privacyProfile, setter: settings.setPrivacyProfile },
                        { label: 'ACTIVITY FEED', value: settings.privacyActivity, setter: settings.setPrivacyActivity },
                        { label: 'STATS & PROGRESS', value: settings.privacyStats, setter: settings.setPrivacyStats },
                      ] as const).map(({ label, value, setter }) => (
                        <div key={label}>
                          <label className="text-[10px] font-display tracking-wider text-muted-foreground">{label}</label>
                          <div className="flex gap-1.5 mt-1">
                            {(['public', 'friends', 'private'] as PrivacySetting[]).map(p => (
                              <button key={p} onClick={() => { setter(p); toast.success(`${label}: ${privacyLabels[p]}`); }}
                                className={`flex-1 py-1.5 text-[10px] font-display tracking-wider border transition-colors ${
                                  value === p ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground/40'
                                }`}>{privacyLabels[p]}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Notifications */}
                  <SectionButton id="notifications" icon={Bell} label="NOTIFICATIONS" />
                  <AnimatePresence>{openSection === 'notifications' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2 space-y-2">
                      {([
                        { label: 'WORKOUT REMINDERS', value: settings.notifWorkoutReminder, setter: settings.setNotifWorkoutReminder },
                        { label: 'WATER REMINDERS', value: settings.notifWaterReminder, setter: settings.setNotifWaterReminder },
                        { label: 'SUPPLEMENT REMINDER', value: settings.notifWeeklyReport, setter: settings.setNotifWeeklyReport },
                        { label: 'WEEKLY REPORT', value: settings.notifWeeklyReport, setter: settings.setNotifWeeklyReport },
                        { label: 'ACHIEVEMENTS', value: settings.notifAchievements, setter: settings.setNotifAchievements },
                      ] as const).map(({ label, value, setter }) => (
                        <button key={label} onClick={() => { setter(!value); toast.success(`${label}: ${!value ? 'ON' : 'OFF'}`); }}
                          className="w-full flex items-center justify-between py-2 px-3 border border-foreground/10 hover:border-foreground/30 transition-colors">
                          <span className="text-xs font-display tracking-wider">{label}</span>
                          {value ? <Bell className="w-3.5 h-3.5 text-strivo-red" /> : <BellOff className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                      ))}
                      <button onClick={async () => {
                        if ('Notification' in window) {
                          const perm = await Notification.requestPermission();
                          if (perm === 'granted') {
                            new Notification('STRIVO', { body: 'Push notifications enabled! 💪', icon: '/favicon.ico' });
                            toast.success('Push notifications enabled');
                          } else {
                            toast.error('Notifications blocked by browser');
                          }
                        } else {
                          toast.error('Browser does not support notifications');
                        }
                      }} className="w-full py-2 px-3 text-xs font-display tracking-wider border border-strivo-red/30 text-strivo-red hover:bg-strivo-red/10 transition-colors">
                        ENABLE PUSH NOTIFICATIONS
                      </button>
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Dashboard Customisation */}
                  <SectionButton id="dashboard" icon={LayoutDashboard} label="DASHBOARD" />
                  <AnimatePresence>{openSection === 'dashboard' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2 space-y-2">
                      {([
                        { label: 'SHOW STEPS', value: settings.dashShowSteps, setter: settings.setDashShowSteps },
                        { label: 'SHOW CALORIES', value: settings.dashShowCalories, setter: settings.setDashShowCalories },
                        { label: 'SHOW WATER', value: settings.dashShowWater, setter: settings.setDashShowWater },
                        { label: 'SHOW HEART RATE', value: settings.dashShowHeartRate, setter: settings.setDashShowHeartRate },
                      ] as const).map(({ label, value, setter }) => (
                        <button key={label} onClick={() => setter(!value)}
                          className="w-full flex items-center justify-between py-2 px-3 border border-foreground/10 hover:border-foreground/30 transition-colors">
                          <span className="text-xs font-display tracking-wider">{label}</span>
                          {value ? <Eye className="w-3.5 h-3.5 text-strivo-red" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                      ))}
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Language */}
                  <SectionButton id="language" icon={Globe} label="LANGUAGE" />
                  <AnimatePresence>{openSection === 'language' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        {langOptions.map(l => (
                          <button key={l.id} onClick={() => { settings.setLanguage(l.id); toast.success(`Language: ${l.label}`); }}
                            className={`py-2 text-xs font-display tracking-wider border transition-colors ${
                              settings.language === l.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground/40'
                            }`}>{l.label}</button>
                        ))}
                      </div>
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Connected Devices */}
                  <SectionButton id="devices" icon={Watch} label="CONNECTED DEVICES" />
                  <AnimatePresence>{openSection === 'devices' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2">
                      <button onClick={handleGoogleFitToggle}
                        className={`w-full flex items-center justify-between py-3 px-4 border transition-colors ${
                          settings.googleFitConnected ? 'border-green-500/40 bg-green-500/10' : 'border-foreground/20 bg-muted/30 hover:border-foreground/40'
                        }`}>
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4" />
                          <div className="text-left">
                            <p className="text-xs font-display tracking-wider">GOOGLE FIT</p>
                            <p className="text-[10px] text-muted-foreground">{settings.googleFitConnected ? 'Connected • Syncing data' : 'Tap to connect'}</p>
                          </div>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.googleFitConnected ? 'bg-green-500' : 'bg-foreground/20'}`}>
                          <motion.div animate={{ x: settings.googleFitConnected ? 20 : 2 }} className="absolute top-0.5 w-4 h-4 rounded-full bg-background" />
                        </div>
                      </button>
                    </motion.div>
                  )}</AnimatePresence>

                  {/* Data Management */}
                  <SectionButton id="data" icon={Trash2} label="DATA MANAGEMENT" />
                  <AnimatePresence>{openSection === 'data' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-2 py-2">
                      {!showDeleteConfirm ? (
                        <button onClick={() => setShowDeleteConfirm(true)}
                          className="w-full py-2.5 text-xs font-display tracking-wider border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                          DELETE ALL LOCAL DATA
                        </button>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                          <p className="text-xs text-red-400">This will clear all fitness logs, settings, and cached data. This cannot be undone.</p>
                          <div className="flex gap-2">
                            <button onClick={handleDeleteData} className="flex-1 py-2 text-xs font-display tracking-wider bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors">CONFIRM DELETE</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 text-xs font-display tracking-wider border border-foreground/20 hover:bg-muted transition-colors">CANCEL</button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}</AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Support Us */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card card-3d">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-strivo-red" />
              <span className="font-display tracking-wider">SUPPORT US</span>
            </div>
            {feedbackSent ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Heart className="w-12 h-12 mx-auto text-strivo-red mb-3" />
                </motion.div>
                <p className="font-display tracking-wider text-sm">THANK YOU! ❤️</p>
                <p className="text-xs text-muted-foreground mt-1">Your feedback helps us improve</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">How would you rate your experience?</p>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setFeedbackHover(star)}
                        onMouseLeave={() => setFeedbackHover(0)}
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 transition-colors"
                      >
                        <Star className={`w-8 h-8 transition-colors ${
                          star <= (feedbackHover || feedbackRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`} />
                      </motion.button>
                    ))}
                  </div>
                  {feedbackRating > 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-muted-foreground mt-1">
                      {feedbackRating <= 2 ? "We'll do better!" : feedbackRating <= 4 ? 'Glad you like it!' : 'Amazing! 🎉'}
                    </motion.p>
                  )}
                </div>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you think... (optional)"
                  className="w-full rounded-2xl border border-input bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={3}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitFeedback}
                  disabled={feedbackSending || feedbackRating === 0}
                  className="w-full py-2.5 rounded-full text-xs font-display tracking-wider bg-strivo-red text-white hover:bg-strivo-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {feedbackSending ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <><MessageSquare className="w-3.5 h-3.5" /> SEND FEEDBACK</>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Logout */}
          <button onClick={handleLogout} className="w-full glass-card flex items-center gap-3 text-strivo-red hover:bg-strivo-red/5 transition-colors rounded-2xl">
            <LogOut className="w-5 h-5" />
            <span className="font-display tracking-wider">LOGOUT</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
