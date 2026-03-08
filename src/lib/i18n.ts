export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml';

export const langLabels: Record<Language, string> = {
  en: 'ENGLISH',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
};

type TranslationKeys = {
  home: string; health: string; shop: string; profile: string;
  defineYourMetrics: string; trackTrainTransform: string; welcomeBack: string;
  todaysTracking: string; steps: string; calories: string; water: string;
  active: string; sleep: string; heartRate: string; healthMetrics: string;
  gearAndDiet: string; settings: string; aiMotivation: string;
  bmiCalculator: string; height: string; weight: string; age: string;
  analyze: string; calculating: string; dietPlan: string; workoutProtocol: string;
  mealPlanner: string; history: string;
  equipment: string; supplements: string; dietFood: string; searchProducts: string;
  compare: string; subscribe: string; addToCart: string; checkout: string;
  cartEmpty: string; goToShop: string; total: string; subtotal: string;
  discount: string; rewardPoints: string; orderPlaced: string; continueShopping: string;
  notLoggedIn: string; loginSignup: string; orderHistory: string; colorTheme: string;
  profileDetails: string; unitPreferences: string; privacy: string; notifications: string;
  dashboard: string; language: string; connectedDevices: string; dataManagement: string;
  logout: string; gender: string; fitnessGoal: string; male: string; female: string;
  other: string; deleteAllData: string;
  download: string; downloadPdf: string; close: string; save: string; cancel: string;
  confirm: string; back: string; freeDelivery: string; qualityAssured: string;
  info: string; nutrition: string; benefits: string; reviews: string;
  ingredients: string; usage: string;
  // Onboarding
  selectGender: string; selectGoal: string; letsGo: string; tellUsAboutYou: string;
};

const en: TranslationKeys = {
  home: 'HOME', health: 'HEALTH', shop: 'SHOP', profile: 'PROFILE',
  defineYourMetrics: 'DEFINE YOUR METRICS',
  trackTrainTransform: 'Track. Train. Transform. Your personal fitness command center.',
  welcomeBack: 'WELCOME BACK', todaysTracking: "TODAY'S TRACKING",
  steps: 'STEPS', calories: 'CALORIES', water: 'WATER', active: 'ACTIVE',
  sleep: 'SLEEP', heartRate: 'HEART RATE', healthMetrics: 'HEALTH METRICS',
  gearAndDiet: 'GEAR & DIET', settings: 'SETTINGS', aiMotivation: 'AI MOTIVATION — TODAY',
  bmiCalculator: 'BMI CALCULATOR', height: 'HEIGHT', weight: 'WEIGHT', age: 'AGE',
  analyze: 'ANALYZE', calculating: 'CALCULATING...', dietPlan: 'RECOMMENDED DIET PLAN',
  workoutProtocol: 'WORKOUT PROTOCOL', mealPlanner: 'MEAL PLANNER', history: 'HISTORY',
  equipment: 'EQUIPMENT', supplements: 'SUPPLEMENTS', dietFood: 'DIET & FOOD',
  searchProducts: 'SEARCH PRODUCTS...', compare: 'COMPARE', subscribe: 'SUBSCRIBE',
  addToCart: 'ADD TO CART', checkout: 'CHECKOUT', cartEmpty: 'CART EMPTY',
  goToShop: 'GO TO SHOP', total: 'TOTAL', subtotal: 'SUBTOTAL', discount: 'DISCOUNT',
  rewardPoints: 'REWARD POINTS', orderPlaced: 'ORDER PLACED', continueShopping: 'CONTINUE SHOPPING',
  notLoggedIn: 'NOT LOGGED IN', loginSignup: 'LOGIN / SIGNUP', orderHistory: 'ORDER HISTORY',
  colorTheme: 'COLOR THEME', profileDetails: 'PROFILE DETAILS', unitPreferences: 'UNIT PREFERENCES',
  privacy: 'PRIVACY', notifications: 'NOTIFICATIONS', dashboard: 'DASHBOARD', language: 'LANGUAGE',
  connectedDevices: 'CONNECTED DEVICES', dataManagement: 'DATA MANAGEMENT', logout: 'LOGOUT',
  gender: 'GENDER', fitnessGoal: 'FITNESS GOAL', male: 'MALE', female: 'FEMALE', other: 'OTHER',
  deleteAllData: 'DELETE ALL LOCAL DATA',
  download: 'DOWNLOAD', downloadPdf: 'DOWNLOAD PDF', close: 'CLOSE', save: 'SAVE',
  cancel: 'CANCEL', confirm: 'CONFIRM', back: 'BACK', freeDelivery: 'FREE DELIVERY',
  qualityAssured: 'QUALITY ASSURED', info: 'INFO', nutrition: 'NUTRITION', benefits: 'BENEFITS',
  reviews: 'REVIEWS', ingredients: 'INGREDIENTS', usage: 'USAGE',
  selectGender: 'SELECT YOUR GENDER', selectGoal: 'SELECT YOUR FITNESS GOAL',
  letsGo: "LET'S GO", tellUsAboutYou: 'TELL US ABOUT YOU',
};

const hi: TranslationKeys = {
  home: 'होम', health: 'स्वास्थ्य', shop: 'दुकान', profile: 'प्रोफ़ाइल',
  defineYourMetrics: 'अपने मेट्रिक्स परिभाषित करें',
  trackTrainTransform: 'ट्रैक। ट्रेन। ट्रांसफॉर्म। आपका व्यक्तिगत फिटनेस कमांड सेंटर।',
  welcomeBack: 'वापसी पर स्वागत है', todaysTracking: 'आज की ट्रैकिंग',
  steps: 'कदम', calories: 'कैलोरी', water: 'पानी', active: 'सक्रिय',
  sleep: 'नींद', heartRate: 'हृदय गति', healthMetrics: 'स्वास्थ्य मेट्रिक्स',
  gearAndDiet: 'उपकरण और आहार', settings: 'सेटिंग्स', aiMotivation: 'AI प्रेरणा — आज',
  bmiCalculator: 'BMI कैलकुलेटर', height: 'ऊंचाई', weight: 'वजन', age: 'आयु',
  analyze: 'विश्लेषण', calculating: 'गणना हो रही है...', dietPlan: 'अनुशंसित आहार योजना',
  workoutProtocol: 'व्यायाम योजना', mealPlanner: 'भोजन योजना', history: 'इतिहास',
  equipment: 'उपकरण', supplements: 'सप्लीमेंट्स', dietFood: 'आहार और भोजन',
  searchProducts: 'उत्पाद खोजें...', compare: 'तुलना', subscribe: 'सदस्यता लें',
  addToCart: 'कार्ट में डालें', checkout: 'चेकआउट', cartEmpty: 'कार्ट खाली है',
  goToShop: 'दुकान पर जाएं', total: 'कुल', subtotal: 'उपयोग', discount: 'छूट',
  rewardPoints: 'रिवॉर्ड पॉइंट्स', orderPlaced: 'ऑर्डर दिया गया', continueShopping: 'खरीदारी जारी रखें',
  notLoggedIn: 'लॉग इन नहीं हैं', loginSignup: 'लॉगिन / साइनअप', orderHistory: 'ऑर्डर इतिहास',
  colorTheme: 'रंग थीम', profileDetails: 'प्रोफ़ाइल विवरण', unitPreferences: 'इकाई प्राथमिकताएं',
  privacy: 'गोपनीयता', notifications: 'सूचनाएं', dashboard: 'डैशबोर्ड', language: 'भाषा',
  connectedDevices: 'कनेक्टेड डिवाइस', dataManagement: 'डेटा प्रबंधन', logout: 'लॉगआउट',
  gender: 'लिंग', fitnessGoal: 'फिटनेस लक्ष्य', male: 'पुरुष', female: 'महिला', other: 'अन्य',
  deleteAllData: 'सभी डेटा हटाएं',
  download: 'डाउनलोड', downloadPdf: 'PDF डाउनलोड', close: 'बंद करें', save: 'सहेजें',
  cancel: 'रद्द करें', confirm: 'पुष्टि करें', back: 'वापस', freeDelivery: 'मुफ्त डिलीवरी',
  qualityAssured: 'गुणवत्ता सुनिश्चित', info: 'जानकारी', nutrition: 'पोषण', benefits: 'फ़ायदे',
  reviews: 'समीक्षाएं', ingredients: 'सामग्री', usage: 'उपयोग',
  selectGender: 'अपना लिंग चुनें', selectGoal: 'अपना फिटनेस लक्ष्य चुनें',
  letsGo: 'चलिए शुरू करें', tellUsAboutYou: 'अपने बारे में बताएं',
};

const ta: TranslationKeys = {
  home: 'முகப்பு', health: 'ஆரோக்கியம்', shop: 'கடை', profile: 'சுயவிவரம்',
  defineYourMetrics: 'உங்கள் அளவீடுகளை வரையறுக்கவும்',
  trackTrainTransform: 'கண்காணிக்கவும். பயிற்சி செய்யவும். மாற்றவும்.',
  welcomeBack: 'வரவேற்கிறோம்', todaysTracking: 'இன்றைய கண்காணிப்பு',
  steps: 'அடிகள்', calories: 'கலோரிகள்', water: 'நீர்', active: 'செயலில்',
  sleep: 'தூக்கம்', heartRate: 'இதய துடிப்பு', healthMetrics: 'ஆரோக்கிய அளவீடுகள்',
  gearAndDiet: 'உபகரணங்கள் & உணவு', settings: 'அமைப்புகள்', aiMotivation: 'AI ஊக்கம் — இன்று',
  bmiCalculator: 'BMI கால்குலேட்டர்', height: 'உயரம்', weight: 'எடை', age: 'வயது',
  analyze: 'பகுப்பாய்வு', calculating: 'கணக்கிடுகிறது...', dietPlan: 'பரிந்துரைக்கப்பட்ட உணவு திட்டம்',
  workoutProtocol: 'உடற்பயிற்சி திட்டம்', mealPlanner: 'உணவு திட்டம்', history: 'வரலாறு',
  equipment: 'உபகரணங்கள்', supplements: 'சப்ளிமெண்ட்ஸ்', dietFood: 'உணவு & சாப்பாடு',
  searchProducts: 'தயாரிப்புகளைத் தேடுக...', compare: 'ஒப்பிடுக', subscribe: 'சந்தா',
  addToCart: 'கார்ட்டில் சேர்', checkout: 'செக்அவுட்', cartEmpty: 'கார்ட் காலியாக உள்ளது',
  goToShop: 'கடைக்குச் செல்', total: 'மொத்தம்', subtotal: 'உட்தொகை', discount: 'தள்ளுபடி',
  rewardPoints: 'வெகுமதி புள்ளிகள்', orderPlaced: 'ஆர்டர் வைக்கப்பட்டது', continueShopping: 'தொடர்ந்து ஷாப்பிங் செய்',
  notLoggedIn: 'உள்நுழையவில்லை', loginSignup: 'உள்நுழைவு / பதிவு', orderHistory: 'ஆர்டர் வரலாறு',
  colorTheme: 'வண்ண தீம்', profileDetails: 'சுயவிவர விவரங்கள்', unitPreferences: 'அலகு முன்னுரிமைகள்',
  privacy: 'தனியுரிமை', notifications: 'அறிவிப்புகள்', dashboard: 'டாஷ்போர்ட்', language: 'மொழி',
  connectedDevices: 'இணைக்கப்பட்ட சாதனங்கள்', dataManagement: 'தரவு மேலாண்மை', logout: 'வெளியேறு',
  gender: 'பாலினம்', fitnessGoal: 'உடற்தகுதி இலக்கு', male: 'ஆண்', female: 'பெண்', other: 'மற்றவை',
  deleteAllData: 'அனைத்து தரவையும் நீக்கு',
  download: 'பதிவிறக்கம்', downloadPdf: 'PDF பதிவிறக்கம்', close: 'மூடு', save: 'சேமி',
  cancel: 'ரத்து', confirm: 'உறுதிப்படுத்து', back: 'பின்', freeDelivery: 'இலவச டெலிவரி',
  qualityAssured: 'தரம் உறுதி', info: 'தகவல்', nutrition: 'ஊட்டச்சத்து', benefits: 'நன்மைகள்',
  reviews: 'மதிப்புரைகள்', ingredients: 'பொருட்கள்', usage: 'பயன்பாடு',
  selectGender: 'உங்கள் பாலினத்தைத் தேர்ந்தெடுக்கவும்', selectGoal: 'உங்கள் உடற்தகுதி இலக்கைத் தேர்ந்தெடுக்கவும்',
  letsGo: 'ஆரம்பிக்கலாம்', tellUsAboutYou: 'உங்களைப் பற்றி சொல்லுங்கள்',
};

const te: TranslationKeys = {
  home: 'హోమ్', health: 'ఆరోగ్యం', shop: 'షాప్', profile: 'ప్రొఫైల్',
  defineYourMetrics: 'మీ మెట్రిక్స్ నిర్వచించండి',
  trackTrainTransform: 'ట్రాక్. ట్రెయిన్. ట్రాన్స్‌ఫార్మ్.',
  welcomeBack: 'తిరిగి స్వాగతం', todaysTracking: 'నేటి ట్రాకింగ్',
  steps: 'అడుగులు', calories: 'కేలరీలు', water: 'నీరు', active: 'యాక్టివ్',
  sleep: 'నిద్ర', heartRate: 'గుండె వేగం', healthMetrics: 'ఆరోగ్య మెట్రిక్స్',
  gearAndDiet: 'సామగ్రి & ఆహారం', settings: 'సెట్టింగ్‌లు', aiMotivation: 'AI ప్రేరణ — నేడు',
  bmiCalculator: 'BMI కాల్కులేటర్', height: 'ఎత్తు', weight: 'బరువు', age: 'వయస్సు',
  analyze: 'విశ్లేషించు', calculating: 'లెక్కిస్తోంది...', dietPlan: 'సిఫార్సు చేసిన ఆహార ప్రణాళిక',
  workoutProtocol: 'వ్యాయామ ప్రణాళిక', mealPlanner: 'భోజన ప్రణాళిక', history: 'చరిత్ర',
  equipment: 'పరికరాలు', supplements: 'సప్లిమెంట్లు', dietFood: 'ఆహారం & భోజనం',
  searchProducts: 'ఉత్పత్తులు వెతకండి...', compare: 'పోల్చండి', subscribe: 'సబ్‌స్క్రైబ్',
  addToCart: 'కార్ట్‌లో చేర్చు', checkout: 'చెక్‌అవుట్', cartEmpty: 'కార్ట్ ఖాళీ',
  goToShop: 'షాప్‌కి వెళ్ళు', total: 'మొత్తం', subtotal: 'ఉపమొత్తం', discount: 'తగ్గింపు',
  rewardPoints: 'రివార్డ్ పాయింట్లు', orderPlaced: 'ఆర్డర్ ఇవ్వబడింది', continueShopping: 'షాపింగ్ కొనసాగించు',
  notLoggedIn: 'లాగిన్ కాలేదు', loginSignup: 'లాగిన్ / సైనప్', orderHistory: 'ఆర్డర్ చరిత్ర',
  colorTheme: 'రంగు థీమ్', profileDetails: 'ప్రొఫైల్ వివరాలు', unitPreferences: 'యూనిట్ ప్రాధాన్యతలు',
  privacy: 'గోప్యత', notifications: 'నోటిఫికేషన్లు', dashboard: 'డ్యాష్‌బోర్డ్', language: 'భాష',
  connectedDevices: 'కనెక్ట్ చేసిన పరికరాలు', dataManagement: 'డేటా నిర్వహణ', logout: 'లాగ్‌అవుట్',
  gender: 'లింగం', fitnessGoal: 'ఫిట్‌నెస్ లక్ష్యం', male: 'పురుషుడు', female: 'స్త్రీ', other: 'ఇతర',
  deleteAllData: 'అన్ని డేటా తొలగించు',
  download: 'డౌన్‌లోడ్', downloadPdf: 'PDF డౌన్‌లోడ్', close: 'మూసివేయి', save: 'సేవ్',
  cancel: 'రద్దు', confirm: 'నిర్ధారించు', back: 'వెనక్కి', freeDelivery: 'ఉచిత డెలివరీ',
  qualityAssured: 'నాణ్యత హామీ', info: 'సమాచారం', nutrition: 'పోషణ', benefits: 'ప్రయోజనాలు',
  reviews: 'సమీక్షలు', ingredients: 'పదార్థాలు', usage: 'వాడకం',
  selectGender: 'మీ లింగాన్ని ఎంచుకోండి', selectGoal: 'మీ ఫిట్‌నెస్ లక్ష్యాన్ని ఎంచుకోండి',
  letsGo: 'ప్రారంభిద్దాం', tellUsAboutYou: 'మీ గురించి చెప్పండి',
};

const kn: TranslationKeys = {
  home: 'ಮುಖಪುಟ', health: 'ಆರೋಗ್ಯ', shop: 'ಅಂಗಡಿ', profile: 'ಪ್ರೊಫೈಲ್',
  defineYourMetrics: 'ನಿಮ್ಮ ಮೆಟ್ರಿಕ್ಸ್ ನಿರ್ಧರಿಸಿ',
  trackTrainTransform: 'ಟ್ರ್ಯಾಕ್. ತರಬೇತಿ. ಪರಿವರ್ತನೆ.',
  welcomeBack: 'ಮರಳಿ ಸ್ವಾಗತ', todaysTracking: 'ಇಂದಿನ ಟ್ರ್ಯಾಕಿಂಗ್',
  steps: 'ಹೆಜ್ಜೆಗಳು', calories: 'ಕ್ಯಾಲೊರಿಗಳು', water: 'ನೀರು', active: 'ಸಕ್ರಿಯ',
  sleep: 'ನಿದ್ರೆ', heartRate: 'ಹೃದಯ ಬಡಿತ', healthMetrics: 'ಆರೋಗ್ಯ ಮೆಟ್ರಿಕ್ಸ್',
  gearAndDiet: 'ಉಪಕರಣ & ಆಹಾರ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', aiMotivation: 'AI ಪ್ರೇರಣೆ — ಇಂದು',
  bmiCalculator: 'BMI ಕ್ಯಾಲ್ಕುಲೇಟರ್', height: 'ಎತ್ತರ', weight: 'ತೂಕ', age: 'ವಯಸ್ಸು',
  analyze: 'ವಿಶ್ಲೇಷಿಸಿ', calculating: 'ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತಿದೆ...', dietPlan: 'ಶಿಫಾರಸು ಮಾಡಿದ ಆಹಾರ ಯೋಜನೆ',
  workoutProtocol: 'ವ್ಯಾಯಾಮ ಯೋಜನೆ', mealPlanner: 'ಊಟದ ಯೋಜನೆ', history: 'ಇತಿಹಾಸ',
  equipment: 'ಉಪಕರಣಗಳು', supplements: 'ಸಪ್ಲಿಮೆಂಟ್‌ಗಳು', dietFood: 'ಆಹಾರ & ಊಟ',
  searchProducts: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...', compare: 'ಹೋಲಿಸಿ', subscribe: 'ಚಂದಾ',
  addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', checkout: 'ಚೆಕ್‌ಔಟ್', cartEmpty: 'ಕಾರ್ಟ್ ಖಾಲಿ',
  goToShop: 'ಅಂಗಡಿಗೆ ಹೋಗಿ', total: 'ಒಟ್ಟು', subtotal: 'ಉಪಮೊತ್ತ', discount: 'ರಿಯಾಯಿತಿ',
  rewardPoints: 'ರಿವಾರ್ಡ್ ಪಾಯಿಂಟ್‌ಗಳು', orderPlaced: 'ಆರ್ಡರ್ ಇಡಲಾಗಿದೆ', continueShopping: 'ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ',
  notLoggedIn: 'ಲಾಗಿನ್ ಆಗಿಲ್ಲ', loginSignup: 'ಲಾಗಿನ್ / ಸೈನಪ್', orderHistory: 'ಆರ್ಡರ್ ಇತಿಹಾಸ',
  colorTheme: 'ಬಣ್ಣ ಥೀಮ್', profileDetails: 'ಪ್ರೊಫೈಲ್ ವಿವರಗಳು', unitPreferences: 'ಘಟಕ ಆದ್ಯತೆಗಳು',
  privacy: 'ಗೌಪ್ಯತೆ', notifications: 'ಅಧಿಸೂಚನೆಗಳು', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', language: 'ಭಾಷೆ',
  connectedDevices: 'ಸಂಪರ್ಕಿತ ಸಾಧನಗಳು', dataManagement: 'ಡೇಟಾ ನಿರ್ವಹಣೆ', logout: 'ಲಾಗ್‌ಔಟ್',
  gender: 'ಲಿಂಗ', fitnessGoal: 'ಫಿಟ್‌ನೆಸ್ ಗುರಿ', male: 'ಪುರುಷ', female: 'ಮಹಿಳೆ', other: 'ಇತರೆ',
  deleteAllData: 'ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಿ',
  download: 'ಡೌನ್‌ಲೋಡ್', downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್', close: 'ಮುಚ್ಚಿ', save: 'ಉಳಿಸಿ',
  cancel: 'ರದ್ದು', confirm: 'ದೃಢೀಕರಿಸಿ', back: 'ಹಿಂದೆ', freeDelivery: 'ಉಚಿತ ಡೆಲಿವರಿ',
  qualityAssured: 'ಗುಣಮಟ್ಟ ಖಾತರಿ', info: 'ಮಾಹಿತಿ', nutrition: 'ಪೋಷಣೆ', benefits: 'ಪ್ರಯೋಜನಗಳು',
  reviews: 'ವಿಮರ್ಶೆಗಳು', ingredients: 'ಪದಾರ್ಥಗಳು', usage: 'ಬಳಕೆ',
  selectGender: 'ನಿಮ್ಮ ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ', selectGoal: 'ನಿಮ್ಮ ಫಿಟ್‌ನೆಸ್ ಗುರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  letsGo: 'ಪ್ರಾರಂಭಿಸೋಣ', tellUsAboutYou: 'ನಿಮ್ಮ ಬಗ್ಗೆ ಹೇಳಿ',
};

const ml: TranslationKeys = {
  home: 'ഹോം', health: 'ആരോഗ്യം', shop: 'ഷോപ്പ്', profile: 'പ്രൊഫൈൽ',
  defineYourMetrics: 'നിങ്ങളുടെ മെട്രിക്സ് നിർവചിക്കുക',
  trackTrainTransform: 'ട്രാക്ക്. ട്രെയിൻ. ട്രാൻസ്ഫോം.',
  welcomeBack: 'തിരികെ സ്വാഗതം', todaysTracking: 'ഇന്നത്തെ ട്രാക്കിംഗ്',
  steps: 'ചുവടുകൾ', calories: 'കലോറികൾ', water: 'വെള്ളം', active: 'ആക്ടീവ്',
  sleep: 'ഉറക്കം', heartRate: 'ഹൃദയമിടിപ്പ്', healthMetrics: 'ആരോഗ്യ മെട്രിക്സ്',
  gearAndDiet: 'ഉപകരണങ്ങൾ & ഭക്ഷണം', settings: 'ക്രമീകരണങ്ങൾ', aiMotivation: 'AI പ്രചോദനം — ഇന്ന്',
  bmiCalculator: 'BMI കാൽക്കുലേറ്റർ', height: 'ഉയരം', weight: 'ഭാരം', age: 'പ്രായം',
  analyze: 'വിശകലനം', calculating: 'കണക്കുകൂട്ടുന്നു...', dietPlan: 'ശുപാർശ ചെയ്ത ഭക്ഷണ പദ്ധതി',
  workoutProtocol: 'വ്യായാമ പദ്ധതി', mealPlanner: 'ഭക്ഷണ ആസൂത്രണം', history: 'ചരിത്രം',
  equipment: 'ഉപകരണങ്ങൾ', supplements: 'സപ്ലിമെന്റുകൾ', dietFood: 'ഭക്ഷണം & ഭക്ഷണക്രമം',
  searchProducts: 'ഉൽപ്പന്നങ്ങൾ തിരയുക...', compare: 'താരതമ്യം', subscribe: 'സബ്‌സ്ക്രൈബ്',
  addToCart: 'കാർട്ടിൽ ചേർക്കുക', checkout: 'ചെക്ക്ഔട്ട്', cartEmpty: 'കാർട്ട് ശൂന്യം',
  goToShop: 'ഷോപ്പിലേക്ക് പോകുക', total: 'ആകെ', subtotal: 'ഉപമൊത്തം', discount: 'കിഴിവ്',
  rewardPoints: 'റിവാർഡ് പോയിന്റുകൾ', orderPlaced: 'ഓർഡർ നൽകി', continueShopping: 'ഷോപ്പിംഗ് തുടരുക',
  notLoggedIn: 'ലോഗിൻ ചെയ്തിട്ടില്ല', loginSignup: 'ലോഗിൻ / സൈനപ്പ്', orderHistory: 'ഓർഡർ ചരിത്രം',
  colorTheme: 'നിറ തീം', profileDetails: 'പ്രൊഫൈൽ വിശദാംശങ്ങൾ', unitPreferences: 'യൂണിറ്റ് മുൻഗണനകൾ',
  privacy: 'സ്വകാര്യത', notifications: 'അറിയിപ്പുകൾ', dashboard: 'ഡാഷ്‌ബോർഡ്', language: 'ഭാഷ',
  connectedDevices: 'ബന്ധിപ്പിച്ച ഉപകരണങ്ങൾ', dataManagement: 'ഡാറ്റ മാനേജ്‌മെന്റ്', logout: 'ലോഗൗട്ട്',
  gender: 'ലിംഗം', fitnessGoal: 'ഫിറ്റ്‌നസ് ലക്ഷ്യം', male: 'പുരുഷൻ', female: 'സ്ത്രീ', other: 'മറ്റുള്ളവ',
  deleteAllData: 'എല്ലാ ഡാറ്റയും ഇല്ലാതാക്കുക',
  download: 'ഡൗൺലോഡ്', downloadPdf: 'PDF ഡൗൺലോഡ്', close: 'അടയ്ക്കുക', save: 'സേവ്',
  cancel: 'റദ്ദാക്കുക', confirm: 'സ്ഥിരീകരിക്കുക', back: 'പിന്നിലേക്ക്', freeDelivery: 'സൗജന്യ ഡെലിവറി',
  qualityAssured: 'ഗുണനിലവാരം ഉറപ്പ്', info: 'വിവരങ്ങൾ', nutrition: 'പോഷണം', benefits: 'ഗുണങ്ങൾ',
  reviews: 'അവലോകനങ്ങൾ', ingredients: 'ചേരുവകൾ', usage: 'ഉപയോഗം',
  selectGender: 'നിങ്ങളുടെ ലിംഗം തിരഞ്ഞെടുക്കുക', selectGoal: 'നിങ്ങളുടെ ഫിറ്റ്‌നസ് ലക്ഷ്യം തിരഞ്ഞെടുക്കുക',
  letsGo: 'തുടങ്ങാം', tellUsAboutYou: 'നിങ്ങളെ കുറിച്ച് പറയൂ',
};

const translations: Record<Language, TranslationKeys> = { en, hi, ta, te, kn, ml };

export const t = (key: keyof TranslationKeys, lang: Language = 'en'): string => {
  return translations[lang]?.[key] || translations.en[key] || key;
};
