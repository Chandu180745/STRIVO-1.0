// Detailed product data: nutritional breakdown, ingredients, usage instructions

export interface ProductDetail {
  nutritionalBreakdown: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar?: string;
    sodium?: string;
  };
  ingredients: string[];
  usage: string;
  longDescription: string;
}

export const productDetails: Record<string, ProductDetail> = {
  // Equipment
  'eq-1': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Cast iron body', 'Chrome-plated handle', 'Anti-rust coating', 'Rubber grip inserts'],
    usage: 'Start with lighter weights for warm-up. Perform 3-4 sets of 8-12 reps for hypertrophy. Rest 60-90 seconds between sets. Store in dry area.',
    longDescription: 'Professional-grade cast iron dumbbells with precision weight calibration. The ergonomic chrome handle provides a secure grip during intense workouts. Anti-roll design keeps them stable on flat surfaces.',
  },
  'eq-2': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Natural latex rubber', 'Nylon webbing handles', 'Metal carabiner clips', 'Door anchor', 'Ankle straps'],
    usage: 'Anchor to a door or fixed point. Start with lightest band (yellow). Progress through colors as strength increases. Can be stacked for more resistance.',
    longDescription: 'Complete 5-band resistance set ranging from 10lbs to 50lbs resistance. Includes door anchor, ankle straps, and carrying bag. Perfect for full-body workouts anywhere.',
  },
  'eq-3': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Heavy-duty steel', 'Foam grip pads', 'Mounting hardware', 'Safety locks'],
    usage: 'Mount on doorframe using included hardware. Test stability before use. Supports up to 150kg. Perform pull-ups, chin-ups, and hanging exercises.',
    longDescription: 'Multi-grip pull-up bar with foam padding for comfortable extended sessions. Fits standard doorframes 60-90cm wide. No drilling required.',
  },
  'eq-4': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['TPE eco-friendly material', 'Anti-slip texture surface', 'Carrying strap', 'Alignment markers'],
    usage: 'Unroll on flat surface. Allow 24h to flatten if stored rolled. Clean with damp cloth after use. Avoid direct sunlight for storage.',
    longDescription: 'Premium 6mm thick yoga mat with dual-layer anti-slip technology. Eco-friendly TPE material is latex-free and hypoallergenic. Features body alignment markers.',
  },
  'eq-5': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Solid cast iron', 'Powder-coated finish', 'Wide flat base', 'Smooth handle'],
    usage: 'Use for swings, goblet squats, Turkish get-ups. Start with lighter weight to master form. 3-5 sets of 10-15 reps for conditioning.',
    longDescription: 'Competition-style 16kg kettlebell with wide flat base for stability. The powder-coated finish provides chalk-friendly grip without gloves.',
  },
  'eq-6': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Steel wire core', 'PVC coating', 'Ball bearings', 'Foam handles', 'Adjustment screws'],
    usage: 'Adjust length to armpit height. Start with basic bounce. Progress to double-unders. 3 rounds of 1 minute with 30s rest.',
    longDescription: 'Professional speed rope with precision ball bearings for ultra-smooth rotation. Adjustable length cable with anti-tangle design.',
  },
  'eq-7': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['High-density EVA foam', 'PVC inner tube', 'Textured surface grid'],
    usage: 'Roll slowly over muscle groups for 30-60 seconds each. Focus on tight areas. Use body weight to control pressure. Best used post-workout.',
    longDescription: 'High-density 33cm foam roller with textured grid pattern for deep tissue massage. Relieves muscle tension, improves flexibility, and speeds recovery.',
  },
  'eq-8': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Heavy gauge steel frame', 'High-density foam padding', 'Vinyl upholstery', 'Rubber feet', 'Adjustment pins'],
    usage: 'Set to flat, incline (30°, 45°, 60°) or decline. Maximum load capacity 300kg. Lock pins securely before use.',
    longDescription: 'Commercial-grade adjustable bench with 7 backrest positions and 3 seat positions. The 300kg weight capacity supports heavy compound lifts.',
  },
  'eq-9': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Dual wheels', 'Steel axle', 'Rubber grip handles', 'Knee pad'],
    usage: 'Start from kneeling position. Extend forward slowly, maintaining core engagement. Roll back to start. Begin with 3 sets of 5-8 reps.',
    longDescription: 'Dual-wheel ab roller with extra-wide base for stability. Includes thick knee pad for comfort during exercises.',
  },
  'eq-10': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Poly dacron rope', 'Heat-shrink handle wraps', 'Anchor strap'],
    usage: 'Anchor to a sturdy post. Perform waves, slams, and spirals. 30 seconds work, 30 seconds rest. 5-8 rounds for full workout.',
    longDescription: '9-meter heavy-duty battle ropes weighing 12kg. 38mm thickness provides optimal grip and resistance for full-body HIIT workouts.',
  },
  // Supplements - Protein
  'sup-1': {
    nutritionalBreakdown: { calories: '120 kcal', protein: '30g', carbs: '2g', fat: '0.5g', fiber: '0g', sugar: '1g', sodium: '100mg' },
    ingredients: ['Whey protein isolate', 'Cocoa powder', 'Sunflower lecithin', 'Natural flavoring', 'Sucralose', 'Digestive enzymes (protease, lactase)'],
    usage: 'Mix 1 scoop (32g) with 200-250ml cold water or milk. Shake vigorously for 15 seconds. Best taken within 30 minutes post-workout or as a snack.',
    longDescription: 'Cold-processed whey protein isolate with 90% protein content. Micro-filtered for maximum purity with minimal lactose. Enhanced with digestive enzymes for better absorption.',
  },
  'sup-2': {
    nutritionalBreakdown: { calories: '130 kcal', protein: '28g', carbs: '4g', fat: '1g', fiber: '0g', sugar: '2g', sodium: '150mg' },
    ingredients: ['Micellar casein', 'Natural cocoa', 'Xanthan gum', 'Stevia extract', 'Calcium caseinate', 'Vitamin B6'],
    usage: 'Mix 1 scoop with 250ml water or milk. Best consumed 30 minutes before bedtime for overnight muscle recovery. Can also be used as a meal replacement.',
    longDescription: 'Slow-digesting micellar casein that provides up to 7 hours of sustained amino acid release. Ideal for overnight muscle repair and growth prevention of catabolism.',
  },
  'sup-3': {
    nutritionalBreakdown: { calories: '110 kcal', protein: '25g', carbs: '3g', fat: '2g', fiber: '1g', sugar: '0g', sodium: '200mg' },
    ingredients: ['Pea protein isolate', 'Brown rice protein', 'Hemp protein', 'Natural vanilla flavor', 'Coconut MCT', 'Stevia'],
    usage: 'Mix 1 scoop (35g) with 250-300ml water, plant milk, or blend into smoothie. Suitable for pre/post workout or as a meal supplement.',
    longDescription: 'Complete amino acid profile from a tri-blend of pea, rice, and hemp proteins. 100% vegan, soy-free, and allergen-friendly with added MCT for sustained energy.',
  },
  'sup-4': {
    nutritionalBreakdown: { calories: '450 kcal', protein: '35g', carbs: '65g', fat: '8g', fiber: '3g', sugar: '12g', sodium: '250mg' },
    ingredients: ['Whey protein concentrate', 'Maltodextrin', 'Oat flour', 'MCT oil powder', 'Creatine monohydrate', 'Digestive enzyme blend'],
    usage: 'Mix 2 scoops (75g) with 400-500ml milk for maximum calories. Best consumed post-workout or between meals. Can split into 2 servings per day.',
    longDescription: 'High-calorie mass gainer designed for hardgainers. 450 calories per serving with a 2:1 carb-to-protein ratio for optimal muscle building and recovery.',
  },
  // Supplements - Performance
  'sup-5': {
    nutritionalBreakdown: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' },
    ingredients: ['Creatine monohydrate (99.9% pure)', 'No fillers', 'No additives'],
    usage: 'Loading phase: 5g 4x daily for 5 days. Maintenance: 3-5g daily with water or juice. Best taken post-workout with carbs for absorption.',
    longDescription: 'Pharmaceutical-grade creatine monohydrate at 99.9% purity. Increases ATP production for explosive power and strength. The most researched and proven supplement.',
  },
  'sup-6': {
    nutritionalBreakdown: { calories: '15 kcal', protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' },
    ingredients: ['L-Leucine', 'L-Isoleucine', 'L-Valine', 'Citric acid', 'Natural fruit flavor', 'Stevia'],
    usage: 'Mix 1 scoop (10g) with 500ml water. Sip during workout or throughout the day. Can be consumed before, during, or after training.',
    longDescription: 'Instantized BCAAs in the scientifically-backed 2:1:1 ratio. Prevents muscle breakdown during training, supports recovery, and reduces post-workout soreness.',
  },
  'sup-7': {
    nutritionalBreakdown: { calories: '10 kcal', protein: '0g', carbs: '2g', fat: '0g', fiber: '0g' },
    ingredients: ['Caffeine anhydrous (200mg)', 'Beta-alanine (3.2g)', 'L-Citrulline (6g)', 'Taurine', 'B-vitamins', 'Black pepper extract'],
    usage: 'Mix 1 scoop with 250ml cold water. Consume 20-30 minutes before workout. Start with half scoop to assess tolerance. Do not exceed 1 scoop daily.',
    longDescription: 'Clinically dosed pre-workout with 200mg caffeine, 6g citrulline, and 3.2g beta-alanine for explosive energy, enhanced blood flow, and delayed fatigue.',
  },
  'sup-8': {
    nutritionalBreakdown: { calories: '10 kcal', protein: '0g', carbs: '0g', fat: '1g', fiber: '0g' },
    ingredients: ['Fish oil concentrate', 'EPA (360mg)', 'DHA (240mg)', 'Vitamin E (as antioxidant)', 'Gelatin softgel capsule'],
    usage: 'Take 2 softgels daily with meals. Can be taken morning or evening. Store in cool, dry place. Refrigerate after opening for freshness.',
    longDescription: 'Molecularly distilled omega-3 fish oil providing 600mg combined EPA+DHA per serving. Supports heart health, brain function, and reduces exercise-induced inflammation.',
  },
  'sup-9': {
    nutritionalBreakdown: { calories: '5 kcal', protein: '0g', carbs: '1g', fat: '0g', fiber: '0g' },
    ingredients: ['Vitamin A', 'Vitamin C', 'Vitamin D3', 'Vitamin E', 'B-Complex', 'Iron', 'Zinc', 'Magnesium', 'Selenium', 'Chromium'],
    usage: 'Take 1 tablet daily with breakfast. Do not exceed recommended dose. Swallow whole with water. Consult doctor if pregnant or on medication.',
    longDescription: 'Comprehensive daily multivitamin with 25+ essential vitamins and minerals specifically formulated for active individuals. Supports immune function, energy metabolism, and recovery.',
  },
  'sup-10': {
    nutritionalBreakdown: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' },
    ingredients: ['Zinc (30mg as zinc monomethionine)', 'Magnesium (450mg as aspartate)', 'Vitamin B6 (10.5mg)', 'Vegetable cellulose capsule'],
    usage: 'Take 3 capsules 30-60 minutes before bedtime on empty stomach. Do not take with dairy or calcium-rich foods as they inhibit absorption.',
    longDescription: 'Scientifically formulated ZMA complex for deep sleep, testosterone support, and enhanced recovery. Zinc and magnesium are commonly depleted through sweat during intense exercise.',
  },
  // Diet products
  'diet-1': {
    nutritionalBreakdown: { calories: '280 kcal', protein: '12g', carbs: '45g', fat: '6g', fiber: '8g', sugar: '8g' },
    ingredients: ['Rolled oats', 'Freeze-dried berries', 'Chia seeds', 'Raw honey granules', 'Flaxseed', 'Cinnamon'],
    usage: 'Add 200ml milk or water. Stir, refrigerate overnight. Top with fresh fruits in the morning. Can also be microwaved for 2 minutes.',
    longDescription: 'Premium overnight oats mix with superfoods. High in fiber and complex carbohydrates for sustained energy. Each packet makes one generous serving.',
  },
  'diet-2': {
    nutritionalBreakdown: { calories: '220 kcal', protein: '10g', carbs: '32g', fat: '6g', fiber: '1g', sugar: '24g' },
    ingredients: ['Whole milk', 'Cocoa powder', 'Cookie crumble', 'Whey protein', 'Sugar', 'Vanilla extract'],
    usage: 'Shake well before opening. Serve chilled. Best consumed within 24 hours of opening. Keep refrigerated at 4°C.',
    longDescription: 'Indulgent chocolate cookie milk with added whey protein. A delicious post-workout treat that delivers 10g protein per 500ml bottle.',
  },
  'diet-3': {
    nutritionalBreakdown: { calories: '60 kcal', protein: '1g', carbs: '13g', fat: '0g', fiber: '3g', sugar: '8g' },
    ingredients: ['Fresh dragon fruit (pitaya)', 'No preservatives', 'Organically grown'],
    usage: 'Slice in half, scoop flesh with spoon. Add to smoothies, bowls, or eat fresh. Store in refrigerator, consume within 3 days.',
    longDescription: 'Fresh organic white-flesh dragon fruit packed with antioxidants, vitamin C, and prebiotics. Sourced from sustainable farms for peak freshness.',
  },
  'diet-4': {
    nutritionalBreakdown: { calories: '350 kcal', protein: '8g', carbs: '52g', fat: '14g', fiber: '6g', sugar: '22g' },
    ingredients: ['Frozen açaí puree', 'Banana', 'Granola', 'Coconut flakes', 'Honey drizzle', 'Mixed berries'],
    usage: 'Thaw for 5 minutes. Blend açaí packet with a splash of juice. Pour into bowl, add toppings. Consume immediately for best texture.',
    longDescription: 'Restaurant-quality açaí bowl kit with premium Brazilian açaí and artisan granola. Rich in antioxidants, healthy fats, and natural energy.',
  },
  'diet-5': {
    nutritionalBreakdown: { calories: '310 kcal', protein: '9g', carbs: '28g', fat: '18g', fiber: '7g', sugar: '2g' },
    ingredients: ['Sourdough bread slice', 'Hass avocado', 'Pink Himalayan salt', 'Red chili flakes', 'Lemon juice packet', 'Everything bagel seasoning'],
    usage: 'Toast bread to desired crispness. Mash avocado with lemon juice and salt. Spread on toast. Add toppings. Best consumed fresh.',
    longDescription: 'Complete avocado toast kit with artisan sourdough and perfectly ripe Hass avocado. Includes gourmet seasonings for a café-quality breakfast at home.',
  },
  'diet-6': {
    nutritionalBreakdown: { calories: '280 kcal', protein: '18g', carbs: '30g', fat: '12g', fiber: '4g', sugar: '18g' },
    ingredients: ['Banana', 'Natural peanut butter', 'Whey protein', 'Whole milk', 'Honey', 'Ice'],
    usage: 'Shake well. Consume within 2 hours of purchase. Keep refrigerated. Best as post-workout recovery drink or mid-day energy boost.',
    longDescription: 'Freshly blended peanut butter banana smoothie with added whey protein. Provides balanced macros with healthy fats, natural sugars, and 18g protein.',
  },
  'diet-7': {
    nutritionalBreakdown: { calories: '250 kcal', protein: '20g', carbs: '30g', fat: '5g', fiber: '2g', sugar: '16g' },
    ingredients: ['Greek yogurt (2% fat)', 'Homemade granola', 'Mixed berries', 'Raw honey', 'Flaxseed'],
    usage: 'Layer yogurt, granola, and berries. Drizzle honey on top. Consume immediately or refrigerate for up to 4 hours. Keep granola separate until serving.',
    longDescription: 'Protein-rich Greek yogurt parfait with house-made granola and seasonal berries. Probiotics support gut health while providing 20g protein per serving.',
  },
  'diet-8': {
    nutritionalBreakdown: { calories: '380 kcal', protein: '15g', carbs: '55g', fat: '12g', fiber: '8g', sugar: '4g' },
    ingredients: ['Organic quinoa', 'Roasted sweet potato', 'Chickpeas', 'Kale', 'Tahini dressing', 'Pumpkin seeds', 'Lemon vinaigrette'],
    usage: 'Can be eaten cold or heated for 2 minutes. Drizzle dressing before serving. Store refrigerated, consume within 48 hours.',
    longDescription: 'Nutrient-dense quinoa bowl with roasted vegetables and plant-based protein from chickpeas. Complete amino acid profile from quinoa makes this a perfect vegan meal.',
  },
  'diet-9': {
    nutritionalBreakdown: { calories: '95 kcal', protein: '3g', carbs: '18g', fat: '1g', fiber: '4g', sugar: '10g' },
    ingredients: ['Fresh spinach', 'Kale', 'Green apple', 'Fresh ginger', 'Lemon juice', 'Celery', 'Cucumber'],
    usage: 'Shake well. Drink on empty stomach for best detox benefits. Consume within 24 hours of purchase. Keep refrigerated.',
    longDescription: 'Cold-pressed green detox smoothie packed with leafy greens and alkalizing ingredients. Supports liver function, digestion, and natural detoxification.',
  },
  'diet-10': {
    nutritionalBreakdown: { calories: '180 kcal', protein: '8g', carbs: '22g', fat: '8g', fiber: '3g', sugar: '14g' },
    ingredients: ['Medjool dates', 'Almonds', 'Whey protein powder', 'Dark chocolate chips', 'Coconut oil', 'Vanilla extract', 'Sea salt'],
    usage: 'Eat 2-3 balls as a pre-workout snack or afternoon pick-me-up. Store in refrigerator for up to 2 weeks. Can be frozen for 3 months.',
    longDescription: 'Handcrafted protein energy balls with Medjool dates and almonds. No artificial sweeteners or preservatives. Each ball delivers 4g protein and natural energy.',
  },
  'diet-11': {
    nutritionalBreakdown: { calories: '450 kcal', protein: '42g', carbs: '40g', fat: '12g', fiber: '5g', sugar: '2g' },
    ingredients: ['Grilled chicken breast', 'Brown basmati rice', 'Steamed broccoli', 'Olive oil', 'Garlic', 'Italian herbs', 'Lemon pepper'],
    usage: 'Microwave for 3-4 minutes with lid slightly open. Let stand 1 minute. Can also be pan-heated. Consume within 3 days of purchase.',
    longDescription: 'Macro-balanced meal prep container with herb-grilled chicken, brown rice, and steamed broccoli. 42g protein per container for serious muscle builders.',
  },
  'diet-12': {
    nutritionalBreakdown: { calories: '200 kcal', protein: '6g', carbs: '22g', fat: '10g', fiber: '10g', sugar: '8g' },
    ingredients: ['Chia seeds', 'Coconut milk', 'Vanilla extract', 'Maple syrup', 'Mixed berries', 'Coconut flakes'],
    usage: 'Ready to eat from refrigerator. Stir before eating. Add fresh berries on top. Consume within 48 hours. Best served cold.',
    longDescription: 'Overnight chia seed pudding made with creamy coconut milk. Exceptionally high in fiber (10g) and omega-3 fatty acids. Topped with seasonal berries.',
  },
  // New products
  'eq-11': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['BPA-free Tritan plastic', 'Stainless steel blending ball', 'Leak-proof lid', 'Measurement markings'],
    usage: 'Add liquid first, then powder. Shake vigorously for 15-20 seconds. Hand wash after each use. Dishwasher safe (top rack only).',
    longDescription: 'Professional-grade 700ml shaker bottle with patented blending ball technology for lump-free shakes. BPA-free Tritan material with leak-proof snap lid.',
  },
  'eq-12': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Genuine leather palm', 'Neoprene back', 'Velcro wrist strap', 'Silicone grip pads', 'Breathable mesh'],
    usage: 'Select size based on hand circumference. Tighten wrist strap for support during heavy lifts. Air dry after use. Replace every 6-12 months.',
    longDescription: 'Premium padded gym gloves with integrated wrist support. Genuine leather palms prevent calluses while silicone grip pads ensure secure hold on bars and dumbbells.',
  },
  'eq-13': {
    nutritionalBreakdown: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' },
    ingredients: ['Full grain leather', 'Steel roller buckle', 'Suede interior lining', '10mm thickness'],
    usage: 'Wear at natural waist during heavy compound lifts (squats, deadlifts). Should be snug but allow deep breath. Break in gradually over 2-3 weeks.',
    longDescription: '10mm genuine leather powerlifting belt with single-prong steel buckle. IPF-approved width for competition use. Provides superior core support during max effort lifts.',
  },
  'sup-11': {
    nutritionalBreakdown: { calories: '5 kcal', protein: '0g', carbs: '1g', fat: '0g', fiber: '0g' },
    ingredients: ['Green tea extract (500mg)', 'L-Carnitine (1000mg)', 'Caffeine anhydrous (150mg)', 'Cayenne pepper extract', 'Black pepper extract (BioPerine)', 'Chromium picolinate'],
    usage: 'Take 1 capsule in the morning with breakfast and 1 capsule before workout. Do not exceed 2 capsules daily. Avoid taking after 4 PM.',
    longDescription: 'Clinically formulated thermogenic fat burner with green tea EGCG and L-Carnitine for enhanced fat metabolism. Boosts metabolic rate and energy expenditure during exercise.',
  },
  'sup-12': {
    nutritionalBreakdown: { calories: '210 kcal', protein: '20g', carbs: '22g', fat: '8g', fiber: '3g', sugar: '6g' },
    ingredients: ['Whey protein blend', 'Dark chocolate chips', 'Peanut butter', 'Oat fiber', 'Chicory root fiber', 'Stevia', 'Soy lecithin'],
    usage: 'Eat as a snack between meals or post-workout. No preparation needed. Store in cool, dry place. Best consumed within 6 months.',
    longDescription: 'Gourmet protein bars with 20g whey protein and real chocolate chips. Low sugar formula with natural sweeteners. Box of 12 bars for 2-week supply.',
  },
  'diet-13': {
    nutritionalBreakdown: { calories: '280 kcal', protein: '8g', carbs: '18g', fat: '22g', fiber: '4g', sugar: '6g' },
    ingredients: ['Roasted almonds', 'Cashews', 'Walnuts', 'Dried cranberries', 'Pumpkin seeds', 'Sea salt'],
    usage: 'Enjoy as a snack, 30g serving size recommended. Store in airtight container. Keep in cool, dry place.',
    longDescription: 'Premium nut and berry trail mix with heart-healthy fats and antioxidants. Lightly salted for perfect flavor balance. Great for on-the-go energy.',
  },
};
