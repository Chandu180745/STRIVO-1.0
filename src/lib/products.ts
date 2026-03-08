// Product images
import dumbbellsImg from '@/assets/products/dumbbells.jpg';
import resistanceBandsImg from '@/assets/products/resistance-bands.jpg';
import yogaMatImg from '@/assets/products/yoga-mat.jpg';
import kettlebellImg from '@/assets/products/kettlebell.jpg';
import foamRollerImg from '@/assets/products/foam-roller.jpg';
import benchImg from '@/assets/products/bench.jpg';
import wheyProteinImg from '@/assets/products/whey-protein.jpg';
import caseinProteinImg from '@/assets/products/casein-protein.jpg';
import plantProteinImg from '@/assets/products/plant-protein.jpg';
import massGainerImg from '@/assets/products/mass-gainer.jpg';
import creatineImg from '@/assets/products/creatine.jpg';
import bcaaImg from '@/assets/products/bcaa.jpg';
import preWorkoutImg from '@/assets/products/pre-workout.jpg';
import omega3Img from '@/assets/products/omega3.jpg';
import multivitaminImg from '@/assets/products/multivitamin.jpg';
import zmaImg from '@/assets/products/zma.jpg';
import oatsImg from '@/assets/products/oats.jpg';
import chocoMilkImg from '@/assets/products/choco-milk.jpg';
import dragonFruitImg from '@/assets/products/dragon-fruit.jpg';
import acaiBowlImg from '@/assets/products/acai-bowl.jpg';
import avocadoToastImg from '@/assets/products/avocado-toast.jpg';
import pbSmoothieImg from '@/assets/products/pb-smoothie.jpg';
import yogurtParfaitImg from '@/assets/products/yogurt-parfait.jpg';
import quinoaBowlImg from '@/assets/products/quinoa-bowl.jpg';
import greenSmoothieImg from '@/assets/products/green-smoothie.jpg';
import energyBallsImg from '@/assets/products/energy-balls.jpg';
import chickenMealImg from '@/assets/products/chicken-meal.jpg';
import chiaPuddingImg from '@/assets/products/chia-pudding.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'equipment' | 'supplements' | 'diet';
  subcategory?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

export const products: Product[] = [
  // Equipment
  { id: 'eq-1', name: 'IRON GRIP DUMBBELLS', price: 4999, description: 'Precision-engineered cast iron dumbbells. 2x 10kg.', image: dumbbellsImg, category: 'equipment', tags: ['strength', 'weights'], rating: 4.8, reviewCount: 124 },
  { id: 'eq-2', name: 'RESISTANCE BANDS SET', price: 1299, description: '5-level resistance bands for progressive training.', image: resistanceBandsImg, category: 'equipment', tags: ['flexibility', 'bands'], rating: 4.6, reviewCount: 89 },
  { id: 'eq-3', name: 'PULL-UP BAR PRO', price: 2499, description: 'Heavy-duty doorframe mounted pull-up bar.', image: '/placeholder.svg', category: 'equipment', tags: ['strength', 'bodyweight'], rating: 4.5, reviewCount: 67 },
  { id: 'eq-4', name: 'YOGA MAT EXTREME', price: 999, description: 'Anti-slip premium yoga mat. 6mm thickness.', image: yogaMatImg, category: 'equipment', tags: ['yoga', 'flexibility'], rating: 4.7, reviewCount: 203 },
  { id: 'eq-5', name: 'KETTLEBELL 16KG', price: 3499, description: 'Cast iron kettlebell with ergonomic grip.', image: kettlebellImg, category: 'equipment', tags: ['strength', 'weights'], rating: 4.9, reviewCount: 56 },
  { id: 'eq-6', name: 'JUMP ROPE SPEED', price: 599, description: 'Ball-bearing speed rope for HIIT training.', image: '/placeholder.svg', category: 'equipment', tags: ['cardio', 'hiit'], rating: 4.4, reviewCount: 145 },
  { id: 'eq-7', name: 'FOAM ROLLER', price: 899, description: 'High-density muscle recovery roller.', image: foamRollerImg, category: 'equipment', tags: ['recovery', 'flexibility'], rating: 4.6, reviewCount: 178 },
  { id: 'eq-8', name: 'ADJUSTABLE BENCH', price: 8999, description: 'Multi-angle workout bench. Steel frame.', image: benchImg, category: 'equipment', tags: ['strength', 'bench'], rating: 4.8, reviewCount: 92 },
  { id: 'eq-9', name: 'AB ROLLER WHEEL', price: 799, description: 'Dual-wheel ab roller with knee pad included.', image: '/placeholder.svg', category: 'equipment', tags: ['core', 'bodyweight'], rating: 4.3, reviewCount: 110 },
  { id: 'eq-10', name: 'BATTLE ROPES 9M', price: 3999, description: 'Heavy-duty battle ropes for full body HIIT.', image: '/placeholder.svg', category: 'equipment', tags: ['cardio', 'hiit', 'strength'], rating: 4.7, reviewCount: 43 },
  // New equipment
  { id: 'eq-11', name: 'PRO SHAKER BOTTLE', price: 499, description: 'Leak-proof 700ml shaker with blending ball.', image: '/placeholder.svg', category: 'equipment', tags: ['accessories', 'shaker'], rating: 4.5, reviewCount: 312 },
  { id: 'eq-12', name: 'GYM GLOVES PRO', price: 799, description: 'Padded lifting gloves with wrist support.', image: '/placeholder.svg', category: 'equipment', tags: ['accessories', 'gloves'], rating: 4.4, reviewCount: 187 },
  { id: 'eq-13', name: 'LIFTING BELT 4"', price: 2999, description: 'Genuine leather powerlifting belt. 10mm thick.', image: '/placeholder.svg', category: 'equipment', tags: ['strength', 'belt'], rating: 4.9, reviewCount: 76 },

  // Supplements - Protein
  { id: 'sup-1', name: 'WHEY ISOLATE 1KG', price: 2999, description: 'Pure whey protein isolate. 30g protein/serving.', image: wheyProteinImg, category: 'supplements', subcategory: 'protein', tags: ['protein', 'muscle'], rating: 4.8, reviewCount: 456 },
  { id: 'sup-2', name: 'CASEIN PROTEIN 1KG', price: 3299, description: 'Slow-release casein for overnight recovery.', image: caseinProteinImg, category: 'supplements', subcategory: 'protein', tags: ['protein', 'recovery'], rating: 4.6, reviewCount: 198 },
  { id: 'sup-3', name: 'PLANT PROTEIN 1KG', price: 2799, description: 'Vegan blend: pea, rice, hemp protein.', image: plantProteinImg, category: 'supplements', subcategory: 'protein', tags: ['protein', 'vegan'], rating: 4.5, reviewCount: 134 },
  { id: 'sup-4', name: 'MASS GAINER 2.5KG', price: 3999, description: 'High-calorie formula for muscle building.', image: massGainerImg, category: 'supplements', subcategory: 'protein', tags: ['protein', 'muscle', 'bulk'], rating: 4.4, reviewCount: 267 },
  // Supplements - Performance
  { id: 'sup-5', name: 'CREATINE MONO 500G', price: 1499, description: 'Pure creatine monohydrate powder.', image: creatineImg, category: 'supplements', subcategory: 'performance', tags: ['performance', 'strength'], rating: 4.9, reviewCount: 523 },
  { id: 'sup-6', name: 'BCAA 300G', price: 1799, description: '2:1:1 BCAA ratio for muscle recovery.', image: bcaaImg, category: 'supplements', subcategory: 'performance', tags: ['performance', 'recovery'], rating: 4.5, reviewCount: 289 },
  { id: 'sup-7', name: 'PRE-WORKOUT X', price: 1999, description: 'Explosive energy blend. Caffeine + Beta-alanine.', image: preWorkoutImg, category: 'supplements', subcategory: 'performance', tags: ['performance', 'energy'], rating: 4.7, reviewCount: 345 },
  { id: 'sup-8', name: 'OMEGA-3 FISH OIL', price: 899, description: '180 softgels. EPA + DHA formula.', image: omega3Img, category: 'supplements', subcategory: 'health', tags: ['health', 'recovery'], rating: 4.6, reviewCount: 412 },
  { id: 'sup-9', name: 'MULTIVITAMIN PACK', price: 699, description: 'Complete daily vitamin & mineral complex.', image: multivitaminImg, category: 'supplements', subcategory: 'health', tags: ['health', 'daily'], rating: 4.7, reviewCount: 567 },
  { id: 'sup-10', name: 'ZMA RECOVERY', price: 1199, description: 'Zinc, Magnesium, B6 for deep sleep.', image: zmaImg, category: 'supplements', subcategory: 'recovery', tags: ['recovery', 'sleep'], rating: 4.5, reviewCount: 178 },
  // New supplements
  { id: 'sup-11', name: 'FAT BURNER EXTREME', price: 1699, description: 'Thermogenic fat burner with green tea & L-carnitine.', image: '/placeholder.svg', category: 'supplements', subcategory: 'performance', tags: ['fat-burner', 'energy', 'weight-loss'], rating: 4.3, reviewCount: 234 },
  { id: 'sup-12', name: 'PROTEIN BAR BOX (12)', price: 1499, description: '20g protein per bar. Choco-peanut flavor.', image: '/placeholder.svg', category: 'supplements', subcategory: 'protein', tags: ['protein', 'snacks', 'convenient'], rating: 4.6, reviewCount: 389 },

  // Diet
  { id: 'diet-1', name: 'OVERNIGHT OATS MIX', price: 349, description: 'Premium oats with berries & honey. Ready in 5 mins.', image: oatsImg, category: 'diet', subcategory: 'breakfast', tags: ['breakfast', 'fiber', 'quick'], rating: 4.5, reviewCount: 156 },
  { id: 'diet-2', name: 'CHOCO COOKIE MILK', price: 199, description: 'Chocolate milk with crushed cookie crumble. 500ml.', image: chocoMilkImg, category: 'diet', subcategory: 'drinks', tags: ['drinks', 'protein', 'indulgent'], rating: 4.7, reviewCount: 234 },
  { id: 'diet-3', name: 'DRAGON FRUIT FRESH', price: 299, description: 'Fresh organic dragon fruit. 500g pack.', image: dragonFruitImg, category: 'diet', subcategory: 'fruits', tags: ['fruits', 'fresh', 'antioxidant'], rating: 4.4, reviewCount: 89 },
  { id: 'diet-4', name: 'AÇAÍ SMOOTHIE BOWL', price: 449, description: 'Frozen açaí blend with granola toppings. Ready-to-eat.', image: acaiBowlImg, category: 'diet', subcategory: 'bowls', tags: ['bowls', 'superfood', 'antioxidant'], rating: 4.8, reviewCount: 312 },
  { id: 'diet-5', name: 'AVOCADO TOAST KIT', price: 399, description: 'Sourdough + ripe avocado + seasoning kit.', image: avocadoToastImg, category: 'diet', subcategory: 'breakfast', tags: ['breakfast', 'healthy-fats', 'quick'], rating: 4.6, reviewCount: 145 },
  { id: 'diet-6', name: 'PB BANANA SMOOTHIE', price: 249, description: 'Peanut butter & banana protein smoothie. 400ml.', image: pbSmoothieImg, category: 'diet', subcategory: 'drinks', tags: ['drinks', 'protein', 'energy'], rating: 4.7, reviewCount: 278 },
  { id: 'diet-7', name: 'GREEK YOGURT PARFAIT', price: 329, description: 'Greek yogurt with granola, berries & honey.', image: yogurtParfaitImg, category: 'diet', subcategory: 'breakfast', tags: ['breakfast', 'protein', 'probiotic'], rating: 4.8, reviewCount: 198 },
  { id: 'diet-8', name: 'QUINOA POWER BOWL', price: 499, description: 'Quinoa salad bowl with roasted veggies.', image: quinoaBowlImg, category: 'diet', subcategory: 'bowls', tags: ['bowls', 'protein', 'vegan'], rating: 4.5, reviewCount: 167 },
  { id: 'diet-9', name: 'GREEN DETOX SMOOTHIE', price: 279, description: 'Spinach, kale, apple & ginger blend. 400ml.', image: greenSmoothieImg, category: 'diet', subcategory: 'drinks', tags: ['drinks', 'detox', 'vitamins'], rating: 4.4, reviewCount: 123 },
  { id: 'diet-10', name: 'ENERGY PROTEIN BALLS', price: 399, description: 'Dates, nuts & protein packed energy bites. 12 pcs.', image: energyBallsImg, category: 'diet', subcategory: 'snacks', tags: ['snacks', 'protein', 'energy'], rating: 4.6, reviewCount: 256 },
  { id: 'diet-11', name: 'CHICKEN MEAL PREP', price: 599, description: 'Grilled chicken with brown rice & broccoli.', image: chickenMealImg, category: 'diet', subcategory: 'meals', tags: ['meals', 'protein', 'muscle'], rating: 4.7, reviewCount: 345 },
  { id: 'diet-12', name: 'CHIA SEED PUDDING', price: 279, description: 'Chia pudding with coconut milk & berries.', image: chiaPuddingImg, category: 'diet', subcategory: 'breakfast', tags: ['breakfast', 'fiber', 'omega-3'], rating: 4.5, reviewCount: 134 },
  // New diet
  { id: 'diet-13', name: 'HEALTHY NUT MIX', price: 449, description: 'Almonds, cashews, walnuts & dried cranberries. 500g.', image: '/placeholder.svg', category: 'diet', subcategory: 'snacks', tags: ['snacks', 'healthy-fats', 'energy'], rating: 4.7, reviewCount: 289 },
];

export const getEquipment = () => products.filter(p => p.category === 'equipment');
export const getSupplements = () => products.filter(p => p.category === 'supplements');
export const getDietProducts = () => products.filter(p => p.category === 'diet');
export const getProteinProducts = () => products.filter(p => p.subcategory === 'protein');
export const getProductById = (id: string) => products.find(p => p.id === id);

// Smart stack recommendations
export interface StackRecommendation {
  id: string;
  name: string;
  goal: string;
  productIds: string[];
  savings: number; // percent
  description: string;
}

export const stackRecommendations: StackRecommendation[] = [
  { id: 'stack-1', name: 'MUSCLE GAIN STACK', goal: 'muscle', productIds: ['sup-1', 'sup-5', 'sup-9'], savings: 12, description: 'Whey Protein + Creatine + Multivitamin for maximum gains.' },
  { id: 'stack-2', name: 'FAT LOSS STACK', goal: 'fat-loss', productIds: ['sup-11', 'sup-6', 'sup-8'], savings: 10, description: 'Fat Burner + BCAA + Omega-3 for lean body transformation.' },
  { id: 'stack-3', name: 'RECOVERY STACK', goal: 'recovery', productIds: ['sup-2', 'sup-10', 'sup-8'], savings: 8, description: 'Casein + ZMA + Omega-3 for deep recovery and sleep.' },
  { id: 'stack-4', name: 'ENERGY STACK', goal: 'energy', productIds: ['sup-7', 'sup-6', 'sup-9'], savings: 10, description: 'Pre-Workout + BCAA + Multivitamin for explosive workouts.' },
  { id: 'stack-5', name: 'BEGINNER STARTER', goal: 'beginner', productIds: ['sup-1', 'sup-9', 'eq-2'], savings: 15, description: 'Whey + Multivitamin + Resistance Bands to kickstart your journey.' },
];
