import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HeightUnit = 'cm' | 'ft/in';
export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'km' | 'miles';
export type EnergyUnit = 'kcal' | 'kJ';
export type WeekStart = 'sunday' | 'monday';
export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'lose-weight' | 'build-muscle' | 'stay-fit' | 'gain-weight' | 'improve-endurance';
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml';
export type PrivacySetting = 'public' | 'friends' | 'private';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutStyle = 'gym' | 'home' | 'yoga' | 'crossfit';
export type SubscriptionPlan = 'free' | 'premium' | 'pro';

export interface BodyMeasurement {
  date: string;
  chest: number;
  waist: number;
  arms: number;
  thighs: number;
  shoulders: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLogEntry {
  id: string;
  date: string;
  category: MealCategory;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface SettingsState {
  // Units
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  energyUnit: EnergyUnit;
  weekStart: WeekStart;
  // Profile
  gender: Gender;
  height: string;
  weight: string;
  age: string;
  bodyFatPercentage: string;
  experienceLevel: ExperienceLevel;
  preferredWorkoutStyles: WorkoutStyle[];
  fitnessGoal: FitnessGoal;
  profilePicture: string;
  // Body tracking
  bodyMeasurements: BodyMeasurement[];
  weightHistory: WeightEntry[];
  // Privacy
  privacyProfile: PrivacySetting;
  privacyActivity: PrivacySetting;
  privacyStats: PrivacySetting;
  // Notifications
  notifWorkoutReminder: boolean;
  notifWaterReminder: boolean;
  notifWeeklyReport: boolean;
  notifAchievements: boolean;
  // Dashboard
  dashShowSteps: boolean;
  dashShowCalories: boolean;
  dashShowWater: boolean;
  dashShowHeartRate: boolean;
  // Language
  language: Language;
  // Devices
  googleFitConnected: boolean;
  // Women's health
  menstrualTrackingEnabled: boolean;
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  sugarLevel: number;
  recoveryScore: number;
  injuryNotes: string[];
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  badges: string[];
  // Rewards
  rewardPoints: number;
  // XP & Levels
  xp: number;
  level: number;
  totalWorkoutsLogged: number;
  totalMealsLogged: number;
  totalGoalsAchieved: number;
  // Challenges
  activeChallenges: string[];
  completedChallenges: string[];
  // Subscription
  subscriptionPlan: SubscriptionPlan;
  subscriptionRenewalDate: string;
  // Onboarding
  onboardingComplete: boolean;
  lastAuthId: string;
  // Nutrition logging
  mealLogs: MealLogEntry[];
  // Setters
  setHeightUnit: (u: HeightUnit) => void;
  setWeightUnit: (u: WeightUnit) => void;
  setDistanceUnit: (u: DistanceUnit) => void;
  setEnergyUnit: (u: EnergyUnit) => void;
  setWeekStart: (w: WeekStart) => void;
  setGender: (g: Gender) => void;
  setHeight: (h: string) => void;
  setWeight: (w: string) => void;
  setAge: (a: string) => void;
  setBodyFatPercentage: (b: string) => void;
  setExperienceLevel: (l: ExperienceLevel) => void;
  setPreferredWorkoutStyles: (s: WorkoutStyle[]) => void;
  setFitnessGoal: (g: FitnessGoal) => void;
  setProfilePicture: (url: string) => void;
  addBodyMeasurement: (m: BodyMeasurement) => void;
  addWeightEntry: (e: WeightEntry) => void;
  setPrivacyProfile: (p: PrivacySetting) => void;
  setPrivacyActivity: (p: PrivacySetting) => void;
  setPrivacyStats: (p: PrivacySetting) => void;
  setNotifWorkoutReminder: (v: boolean) => void;
  setNotifWaterReminder: (v: boolean) => void;
  setNotifWeeklyReport: (v: boolean) => void;
  setNotifAchievements: (v: boolean) => void;
  setDashShowSteps: (v: boolean) => void;
  setDashShowCalories: (v: boolean) => void;
  setDashShowWater: (v: boolean) => void;
  setDashShowHeartRate: (v: boolean) => void;
  setLanguage: (l: Language) => void;
  setGoogleFitConnected: (v: boolean) => void;
  setMenstrualTrackingEnabled: (v: boolean) => void;
  setLastPeriodDate: (d: string) => void;
  setCycleLength: (n: number) => void;
  setPeriodLength: (n: number) => void;
  setSugarLevel: (n: number) => void;
  setRecoveryScore: (n: number) => void;
  addInjuryNote: (note: string) => void;
  removeInjuryNote: (index: number) => void;
  recordActivity: () => void;
  addBadge: (badge: string) => void;
  addRewardPoints: (pts: number) => void;
  addXP: (amount: number) => void;
  incrementWorkouts: () => void;
  incrementMeals: () => void;
  incrementGoals: () => void;
  joinChallenge: (id: string) => void;
  completeChallenge: (id: string) => void;
  setSubscriptionPlan: (p: SubscriptionPlan) => void;
  setOnboardingComplete: (v: boolean) => void;
  setLastAuthId: (id: string) => void;
  addMealLog: (entry: MealLogEntry) => void;
  removeMealLog: (id: string) => void;
  getTodayMeals: () => MealLogEntry[];
  clearAllData: () => void;
}

const defaults = {
  heightUnit: 'cm' as HeightUnit,
  weightUnit: 'kg' as WeightUnit,
  distanceUnit: 'km' as DistanceUnit,
  energyUnit: 'kcal' as EnergyUnit,
  weekStart: 'monday' as WeekStart,
  gender: 'male' as Gender,
  height: '',
  weight: '',
  age: '',
  bodyFatPercentage: '',
  experienceLevel: 'beginner' as ExperienceLevel,
  preferredWorkoutStyles: [] as WorkoutStyle[],
  fitnessGoal: 'stay-fit' as FitnessGoal,
  profilePicture: '',
  bodyMeasurements: [] as BodyMeasurement[],
  weightHistory: [] as WeightEntry[],
  privacyProfile: 'public' as PrivacySetting,
  privacyActivity: 'friends' as PrivacySetting,
  privacyStats: 'friends' as PrivacySetting,
  notifWorkoutReminder: true,
  notifWaterReminder: true,
  notifWeeklyReport: true,
  notifAchievements: true,
  dashShowSteps: true,
  dashShowCalories: true,
  dashShowWater: true,
  dashShowHeartRate: true,
  language: 'en' as Language,
  googleFitConnected: false,
  menstrualTrackingEnabled: false,
  lastPeriodDate: '',
  cycleLength: 28,
  periodLength: 5,
  sugarLevel: 0,
  recoveryScore: 0,
  injuryNotes: [] as string[],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  badges: [] as string[],
  rewardPoints: 0,
  xp: 0,
  level: 1,
  totalWorkoutsLogged: 0,
  totalMealsLogged: 0,
  totalGoalsAchieved: 0,
  activeChallenges: [] as string[],
  completedChallenges: [] as string[],
  subscriptionPlan: 'free' as SubscriptionPlan,
  subscriptionRenewalDate: '',
  onboardingComplete: false,
  lastAuthId: '',
  mealLogs: [] as MealLogEntry[],
};

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaults,
      setHeightUnit: (heightUnit) => set({ heightUnit }),
      setWeightUnit: (weightUnit) => set({ weightUnit }),
      setDistanceUnit: (distanceUnit) => set({ distanceUnit }),
      setEnergyUnit: (energyUnit) => set({ energyUnit }),
      setWeekStart: (weekStart) => set({ weekStart }),
      setGender: (gender) => set({ gender }),
      setHeight: (height) => set({ height }),
      setWeight: (weight) => set({ weight }),
      setAge: (age) => set({ age }),
      setBodyFatPercentage: (bodyFatPercentage) => set({ bodyFatPercentage }),
      setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
      setPreferredWorkoutStyles: (preferredWorkoutStyles) => set({ preferredWorkoutStyles }),
      setFitnessGoal: (fitnessGoal) => set({ fitnessGoal }),
      setProfilePicture: (profilePicture) => set({ profilePicture }),
      addBodyMeasurement: (m) => set(s => ({ bodyMeasurements: [...s.bodyMeasurements.slice(-29), m] })),
      addWeightEntry: (e) => set(s => ({ weightHistory: [...s.weightHistory.slice(-59), e] })),
      setPrivacyProfile: (privacyProfile) => set({ privacyProfile }),
      setPrivacyActivity: (privacyActivity) => set({ privacyActivity }),
      setPrivacyStats: (privacyStats) => set({ privacyStats }),
      setNotifWorkoutReminder: (notifWorkoutReminder) => set({ notifWorkoutReminder }),
      setNotifWaterReminder: (notifWaterReminder) => set({ notifWaterReminder }),
      setNotifWeeklyReport: (notifWeeklyReport) => set({ notifWeeklyReport }),
      setNotifAchievements: (notifAchievements) => set({ notifAchievements }),
      setDashShowSteps: (dashShowSteps) => set({ dashShowSteps }),
      setDashShowCalories: (dashShowCalories) => set({ dashShowCalories }),
      setDashShowWater: (dashShowWater) => set({ dashShowWater }),
      setDashShowHeartRate: (dashShowHeartRate) => set({ dashShowHeartRate }),
      setLanguage: (language) => set({ language }),
      setGoogleFitConnected: (googleFitConnected) => set({ googleFitConnected }),
      setMenstrualTrackingEnabled: (menstrualTrackingEnabled) => set({ menstrualTrackingEnabled }),
      setLastPeriodDate: (lastPeriodDate) => set({ lastPeriodDate }),
      setCycleLength: (cycleLength) => set({ cycleLength }),
      setPeriodLength: (periodLength) => set({ periodLength }),
      setSugarLevel: (sugarLevel) => set({ sugarLevel }),
      setRecoveryScore: (recoveryScore) => set({ recoveryScore }),
      addInjuryNote: (note) => set(s => ({ injuryNotes: [...s.injuryNotes, note] })),
      removeInjuryNote: (index) => set(s => ({ injuryNotes: s.injuryNotes.filter((_, i) => i !== index) })),
      recordActivity: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        if (state.lastActiveDate === today) return;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = state.lastActiveDate === yesterday ? state.currentStreak + 1 : 1;
        const newLongest = Math.max(state.longestStreak, newStreak);
        const newBadges = [...state.badges];
        let bonusPoints = 0;
        if (newStreak >= 7 && !newBadges.includes('7-day-streak')) { newBadges.push('7-day-streak'); bonusPoints += 100; }
        if (newStreak >= 30 && !newBadges.includes('30-day-streak')) { newBadges.push('30-day-streak'); bonusPoints += 500; }
        if (newStreak >= 100 && !newBadges.includes('100-day-streak')) { newBadges.push('100-day-streak'); bonusPoints += 1000; }
        set({
          currentStreak: newStreak, longestStreak: newLongest, lastActiveDate: today, badges: newBadges,
          rewardPoints: state.rewardPoints + bonusPoints,
        });
      },
      addBadge: (badge) => set(s => ({ badges: s.badges.includes(badge) ? s.badges : [...s.badges, badge] })),
      addRewardPoints: (pts) => set(s => ({ rewardPoints: s.rewardPoints + pts })),
      addXP: (amount) => set(s => {
        const newXP = s.xp + amount;
        const newLevel = Math.floor(newXP / 500) + 1;
        return { xp: newXP, level: Math.min(newLevel, 50) };
      }),
      incrementWorkouts: () => set(s => ({ totalWorkoutsLogged: s.totalWorkoutsLogged + 1 })),
      incrementMeals: () => set(s => ({ totalMealsLogged: s.totalMealsLogged + 1 })),
      incrementGoals: () => set(s => ({ totalGoalsAchieved: s.totalGoalsAchieved + 1 })),
      joinChallenge: (id) => set(s => ({ activeChallenges: s.activeChallenges.includes(id) ? s.activeChallenges : [...s.activeChallenges, id] })),
      completeChallenge: (id) => set(s => ({ activeChallenges: s.activeChallenges.filter(c => c !== id), completedChallenges: [...s.completedChallenges, id] })),
      setSubscriptionPlan: (subscriptionPlan) => set({ subscriptionPlan }),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      setLastAuthId: (lastAuthId) => set({ lastAuthId }),
      addMealLog: (entry) => set(s => ({ mealLogs: [...s.mealLogs.slice(-199), entry] })),
      removeMealLog: (id) => set(s => ({ mealLogs: s.mealLogs.filter(m => m.id !== id) })),
      getTodayMeals: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().mealLogs.filter(m => m.date === today);
      },
      clearAllData: () => {
        localStorage.removeItem('strivo-fitness');
        set({ ...defaults });
      },
    }),
    { name: 'strivo-settings' }
  )
);
