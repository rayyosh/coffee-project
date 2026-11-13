import React, { useState, useEffect, useMemo, useRef } from 'react';
import CoffeCard from './components/CoffeCard';
import NewsCard from './components/NewsCard';
import './App.css';

/**
 * VelourRoast - Specialty Coffee Shop & Roastery Web Platform
 * Asosiy sahifa va global holatlar boshqaruvi (App.jsx)
 */

const COFFEE_CATALOG = [
  {
    id: 'vr-101',
    name: 'Velour Velvet Cortado',
    tagline: '100% Specialty Arabica • Efiopiya Guji',
    description:
      "Ikki hissa ristretto va ipakdek mayin bug'langan sutning mukammal muvozanati. Tabiiy karamel va qovurilgan funduk notalari bilan.",
    price: 32000,
    oldPrice: 38000,
    image:
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=85',
    category: 'Mualliflik',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 214,
    roast: 3,
    caffeine: 150,
    calories: 125,
    prepMinutes: '3-4 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    tastingNotes: ['Karamel', 'Funduk', 'Sutli shokolad'],
    tasteProfile: { sweetness: 80, acidity: 40, body: 85 },
    origin: {
      region: 'Guji, Efiopiya',
      altitude: '2,100 m',
      process: 'Natural (Quruq usul)',
      harvest: '2026 Bahorgi hosil',
    },
  },
  {
    id: 'vr-102',
    name: 'Tashkent Saffron Raf',
    tagline: 'Mualliflik retsepti • Eron za’faroni & Vanil',
    description:
      "Qaymoqli raf qahvasining sharqona talqini: haqiqiy za'faron tolalari, Madagaskar vanili va oltin rangli mikro-ko'pik.",
    price: 39000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85',
    category: 'Mualliflik',
    badge: 'Chef Choice',
    rating: 5.0,
    reviews: 189,
    roast: 2,
    caffeine: 135,
    calories: 240,
    prepMinutes: '5-6 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    tastingNotes: ["Za'faron", 'Vanil', 'Qaymoq'],
    tasteProfile: { sweetness: 92, acidity: 25, body: 90 },
    origin: {
      region: 'Huila, Kolumbiya',
      altitude: '1,850 m',
      process: 'Washed (Yuvilgan)',
      harvest: '2026 Yozgi hosil',
    },
  },
  {
    id: 'vr-103',
    name: 'Double Velvet Espresso',
    tagline: 'Sof energiya • Braziliya & Keniya blendi',
    description:
      "Qalin krema qatlamiga ega klassik qo'shaloq espresso. Yovvoyi olcha kislotaliligi va achchiq kakao yakuni bilan.",
    price: 22000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=85',
    category: 'Espresso Bar',
    badge: null,
    rating: 4.8,
    reviews: 142,
    roast: 4,
    caffeine: 185,
    calories: 15,
    prepMinutes: '2-3 daq',
    inStock: true,
    allowMilk: false,
    allowIce: true,
    tastingNotes: ['Qora kakao', 'Qizil olcha', 'Qovurilgan bodom'],
    tasteProfile: { sweetness: 45, acidity: 65, body: 95 },
    origin: {
      region: 'Cerrado, Braziliya',
      altitude: '1,300 m',
      process: 'Pulped Natural',
      harvest: '2026 Asosiy hosil',
    },
  },
  {
    id: 'vr-104',
    name: 'Kyoto Nitro Cold Brew',
    tagline: '18 soatlik sovuq ekstraksiya • Azot bilan',
    description:
      "Muzdek suvda 18 soat davomida tomchilatib tayyorlangan va azot bilan boyitilgan ipakdek silliq, gazlangan qora qahva.",
    price: 36000,
    oldPrice: 42000,
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=85',
    category: 'Muzdek & Cold Brew',
    badge: 'Yangi',
    rating: 4.9,
    reviews: 97,
    roast: 2,
    caffeine: 210,
    calories: 10,
    prepMinutes: '2 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    defaultTemp: 'iced',
    tastingNotes: ['Bergamot', 'Qora smorodina', 'Shokolad'],
    tasteProfile: { sweetness: 68, acidity: 72, body: 78 },
    origin: {
      region: 'Nyeri, Keniya',
      altitude: '1,900 m',
      process: 'Double Washed',
      harvest: '2026 Mikro-lot',
    },
  },
  {
    id: 'vr-105',
    name: 'Salted Caramel Flat White',
    tagline: 'Avstraliya klassikasi • Uyda pishirilgan karamel',
    description:
      "Ikki hissa espresso ustiga quyilgan yupqa mikro-ko'pik va dengiz tuzi qo'shilgan tabiiy karamel sousi.",
    price: 35000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=900&q=85',
    category: 'Espresso Bar',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 276,
    roast: 3,
    caffeine: 160,
    calories: 175,
    prepMinutes: '4-5 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    tastingNotes: ['Tuzli karamel', 'Qovurilgan shakar', 'Sut'],
    tasteProfile: { sweetness: 84, acidity: 38, body: 82 },
    origin: {
      region: 'Antigua, Gvatemala',
      altitude: '1,700 m',
      process: 'Washed',
      harvest: '2026 Bahorgi hosil',
    },
  },
  {
    id: 'vr-106',
    name: 'Ceremonial Uji Matcha Latte',
    tagline: 'Yaponiya Uji mintaqasi • 1-terim ko‘k choyi',
    description:
      "Tosh tegirmonda maydalangan oliy navli yapon matcha kukuni va suli suti bilan tayyorlangan antioksidantlarga boy ichimlik.",
    price: 37000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85',
    category: 'Matcha & Choy',
    badge: 'Organik',
    rating: 4.8,
    reviews: 131,
    roast: 1,
    caffeine: 70,
    calories: 140,
    prepMinutes: '4 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    tastingNotes: ['Yashil barg', 'Oq shokolad', 'Umami'],
    tasteProfile: { sweetness: 70, acidity: 30, body: 75 },
    origin: {
      region: 'Uji, Kyoto, Yaponiya',
      altitude: '450 m',
      process: 'Soyada yetishtirilgan',
      harvest: '2026 Ichibancha',
    },
  },
  {
    id: 'vr-107',
    name: 'Orange Espresso Tonic',
    tagline: 'Sitrus tetikligi • Yangi siqilgan apelsin',
    description:
      "Muz bo'laklari, premium tonik, yangi qizil apelsin sharbati va ustidan sekin quyilgan Efiopiya espressosi.",
    price: 34000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85',
    category: 'Muzdek & Cold Brew',
    badge: 'Yozgi Xit',
    rating: 4.9,
    reviews: 158,
    roast: 2,
    caffeine: 145,
    calories: 110,
    prepMinutes: '3-4 daq',
    inStock: true,
    allowMilk: false,
    allowIce: true,
    defaultTemp: 'iced',
    tastingNotes: ['Qizil apelsin', 'Greypfrut', 'Gullik'],
    tasteProfile: { sweetness: 65, acidity: 88, body: 60 },
    origin: {
      region: 'Yirgacheffe, Efiopiya',
      altitude: '2,050 m',
      process: 'Washed',
      harvest: '2026 Mikro-lot',
    },
  },
  {
    id: 'vr-108',
    name: 'Belgian Dark Mocha',
    tagline: '72% Belgiya shokoladi • Barista kakao',
    description:
      "Eritilgan haqiqiy Belgiya qora shokoladi, boy espresso va baxmaldek yumshoq bug'langan sut uyg'unligi.",
    price: 36000,
    oldPrice: 41000,
    image:
      'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=900&q=85',
    category: 'Espresso Bar',
    badge: null,
    rating: 4.8,
    reviews: 119,
    roast: 4,
    caffeine: 155,
    calories: 265,
    prepMinutes: '5 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    tastingNotes: ['72% Shokolad', 'Kakao', 'Vanil'],
    tasteProfile: { sweetness: 86, acidity: 32, body: 92 },
    origin: {
      region: 'Minas Gerais, Braziliya',
      altitude: '1,250 m',
      process: 'Natural',
      harvest: '2026 Asosiy hosil',
    },
  },
  {
    id: 'vr-109',
    name: 'Pistachio Baklava Latte',
    tagline: 'Eron pistasi pastasi • Asal va kardamon',
    description:
      "Tabiiy qovurilgan pista pastasi, bir chimdim kardamon va tog' asali bilan boyitilgan noyob sharqona latte.",
    price: 42000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=85',
    category: 'Mualliflik',
    badge: 'Limited',
    rating: 5.0,
    reviews: 203,
    roast: 3,
    caffeine: 140,
    calories: 255,
    prepMinutes: '5-6 daq',
    inStock: true,
    allowMilk: true,
    allowIce: true,
    tastingNotes: ['Qovurilgan pista', "Tog' asali", 'Kardamon'],
    tasteProfile: { sweetness: 89, acidity: 28, body: 88 },
    origin: {
      region: 'Tarrazu, Kosta-Rika',
      altitude: '1,750 m',
      process: 'Honey Process',
      harvest: '2026 Mikro-lot',
    },
  },
  {
    id: 'vr-110',
    name: 'San Sebastian Burnt Cheesecake',
    tagline: 'Qahva bilan ideal juftlik • Kremli tekstura',
    description:
      "Yuqori haroratda karamellashgan ustki qatlam va ichida erib ketuvchi yumshoq pishloqli ispan deserti.",
    price: 38000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85',
    category: 'Desertlar',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 312,
    roast: 1,
    caffeine: 0,
    calories: 380,
    prepMinutes: '2 daq',
    inStock: true,
    allowMilk: false,
    allowIce: false,
    tastingNotes: ['Karamel qobiq', 'Mascarpone', 'Vanil'],
    tasteProfile: { sweetness: 85, acidity: 35, body: 95 },
    origin: {
      region: 'Velour Bakery Lab, Toshkent',
      altitude: 'Har kuni yangi',
      process: 'Hunarmandchilik retsepti',
      harvest: 'Bugun pishirilgan',
    },
  },
  {
    id: 'vr-111',
    name: 'Almond Frangipane Croissant',
    tagline: 'Fransuz sariyog‘i • 27 qavatli xamir',
    description:
      "Yangi uzilgan qovurilgan bodom kremi bilan to'ldirilgan va ustiga bodom yaproqlari sepilgan xrustyashka kruassan.",
    price: 29000,
    oldPrice: 34000,
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85',
    category: 'Desertlar',
    badge: null,
    rating: 4.8,
    reviews: 174,
    roast: 1,
    caffeine: 0,
    calories: 340,
    prepMinutes: '2 daq',
    inStock: true,
    allowMilk: false,
    allowIce: false,
    tastingNotes: ['Sariyog‘', 'Bodom kremi', 'Shakar upasi'],
    tasteProfile: { sweetness: 78, acidity: 20, body: 85 },
    origin: {
      region: 'Velour Bakery Lab, Toshkent',
      altitude: 'Ertalabki pishiriq',
      process: '72 soatlik fermentatsiya',
      harvest: 'Bugun pishirilgan',
    },
  },
  {
    id: 'vr-112',
    name: 'Cascara & Hibiscus Iced Tea',
    tagline: 'Qahva mevasining po‘stlog‘i • Rezavorlar',
    description:
      "Quritilgan qahva gilosi po'stlog'i (Cascara), gibiskus gullari va yovvoyi malinadan damlangan tetiklantiruvchi choy.",
    price: 28000,
    oldPrice: null,
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85',
    category: 'Matcha & Choy',
    badge: 'Yangi',
    rating: 4.7,
    reviews: 84,
    roast: 1,
    caffeine: 45,
    calories: 65,
    prepMinutes: '3 daq',
    inStock: true,
    allowMilk: false,
    allowIce: true,
    defaultTemp: 'iced',
    tastingNotes: ['Qahva gilosi', 'Malina', 'Atirgul'],
    tasteProfile: { sweetness: 72, acidity: 78, body: 50 },
    origin: {
      region: 'Boquete, Panama',
      altitude: '1,800 m',
      process: 'Sun-dried Cascara',
      harvest: '2026 Hosil',
    },
  },
];

const JOURNAL_ARTICLES = [
  {
    id: 'news-01',
    title: 'VelourRoast kuzgi mikro-lot kolleksiyasi va yangi V60 damlash texnikasini taqdim etdi',
    summary:
      "Bosh roasterlarimiz Efiopiya Guji va Panama Boquete hududlaridan keltirilgan sara hosil donlarini maxsus harorat profilida qovurib, kuzgi mavsum uchun yangi ta'm palitrasini yaratdilar.",
    paragraphs: [
      "Har bir finjon mukammal qahva ortida yuzlab soatlik tajriba, to'g'ri tanlangan suv mineralizatsiyasi va aniq harorat nazorati yotadi. VelourRoast jamoasi kuzgi mavsum oldidan o'zining yangi 'Velvet Harvest' mikro-lot kolleksiyasini taqdim etdi.",
      "Ushbu kolleksiyadagi donlar anaerobik fermentatsiya usulida qayta ishlangan bo'lib, ularda yovvoyi rezavorlar, bergamot, qora shokolad va qovurilgan funduk notalari yaqqol seziladi. Ayniqsa V60 va Chemex muqobil damlash usullarida bu ta'mlar yanada chuqurroq ochiladi.",
      "Bundan tashqari, har hafta juma va shanba kunlari Toshkentdagi markaziy filialimizda ochiq 'Coffee Cupping & Latte Art' mahorat darslari tashkil etilmoqda. Mehmonlar professional baristalar bilan birga qahva ekstraksiyasi sirlarini amalda sinab ko'rishlari mumkin.",
    ],
    category: 'Roastery Jurnali',
    publishedAt: '13 Noyabr, 2026',
    readDuration: '5 daqiqa',
    viewsCount: 1840,
    likes: 124,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
    author: {
      name: 'Saidakbar',
      title: 'Asoschi & Q-Grader Roaster',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=85',
    },
    tags: ['VelourRoast', 'Specialty', 'V60', 'MikroLot'],
    isEvent: true,
    eventSchedule: 'Shanba, 16:00 • Amir Temur filiali',
    branchAddress: 'Toshkent sh., Amir Temur shoh ko‘chasi, 48-uy',
  },
  {
    id: 'news-02',
    title: 'Uyda professional darajada Pour-Over (V60) qahva damlashning 5 oltin qoidasi',
    summary:
      "Suv harorati, maydalash o'lchami (grind size) va blooming bosqichi nega muhim? Bosh baristamizdan uyda qahvaxona sifatiga erishish bo'yicha qo'llanma.",
    paragraphs: [
      "Ko'pchilik uyda qahva damlaganda ta'm haddan tashqari achchiq yoki aksincha nordon chiqishidan shikoyat qiladi. Buning asosiy sababi — ekstraksiya vaqti va suv haroratining nomutanosibligidir.",
      "Birinchi qoida: har doim yangi qovurilgan (7 kundan 30 kungacha bo'lgan) donlardan foydalaning va ularni damlashdan 1 daqiqa oldin maydalang. V60 uchun o'rtacha dengiz tuzi kattaligidagi maydalash ideal hisoblanadi.",
      "Ikkinchi qoida: suv harorati 92°C – 94°C oralig'ida bo'lishi kerak. Dastlabki 30 soniyada qahva og'irligidan ikki barobar ko'p suv quyib 'blooming' (gaz chiqarish) jarayonini kuting.",
    ],
    category: 'Barista Qo‘llanmasi',
    publishedAt: '10 Noyabr, 2026',
    readDuration: '4 daqiqa',
    viewsCount: 960,
    likes: 89,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Madina Alimova',
      title: 'Bosh Barista Trener',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=85',
    },
    tags: ['V60', 'Qo‘llanma', 'BaristaSirlari'],
    isEvent: false,
  },
  {
    id: 'news-03',
    title: 'Tashkent City bog‘i yonida yangi VelourRoast Lounge filiali ochildi!',
    summary:
      "Panoramic derazalar, kovorking zonasi, tezkor Wi-Fi va faqat shu filialda taqdim etiladigan maxsus 'Night Espresso' menyusi sizni kutmoqda.",
    paragraphs: [
      "Sizning talablaringizga binoan Toshkentning eng go'zal nuqtalaridan birida uchinchi va eng katta VelourRoast Lounge filialimiz o'z eshiklarini ochdi.",
      "Yangi maskanda 65 o'rinli qulay zal, muzokaralar va dasturchilar uchun maxsus rozetkali sokin ish hududi hamda ochiq terassa mavjud. Kechki soat 19:00 dan keyin esa jonli akustik musiqa va kofeinsiz mualliflik ichimliklari taqdim etiladi.",
    ],
    category: 'Filial Yangiliklari',
    publishedAt: '05 Noyabr, 2026',
    readDuration: '3 daqiqa',
    viewsCount: 1520,
    likes: 156,
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Jasur Rahimov',
      title: 'Brend Menejer',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85',
    },
    tags: ['YangiFilial', 'TashkentCity', 'Kovorking'],
    isEvent: true,
    eventSchedule: 'Har kuni 07:30 – 23:30 • Tashkent City',
    branchAddress: 'Toshkent sh., Islom Karimov ko‘chasi, Tashkent City 4-blok',
  },
  {
    id: 'news-04',
    title: 'Latte Art Chempionati 2026: VelourRoast baristalari g‘oliblikni qo‘lga kiritdi',
    summary:
      "Markaziy Osiyo qahva festivalida jamoamiz a'zolari murakkab rozetta va oqqush kompozitsiyalari bilan hakamlarning eng yuqori ballarini to'plashdi.",
    paragraphs: [
      "O'tgan hafta bo'lib o'tgan mintaqaviy Barista va Latte Art chempionatida VelourRoast jamoasi 40 dan ortiq professional ishtirokchilar orasida birinchi o'rinni egalladi.",
      "Ushbu g'alaba sharafiga hafta oxirigacha barcha mehmonlarimizga buyurtma berilgan har bir Cappuccino yoki Flat White ustiga shaxsiy portret yoki maxsus naqsh chizib berish xizmati bepul taqdim etiladi.",
    ],
    category: 'Yutuqlar & Tadbirlar',
    publishedAt: '01 Noyabr, 2026',
    readDuration: '3 daqiqa',
    viewsCount: 1120,
    likes: 112,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Madina Alimova',
      title: 'Bosh Barista Trener',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=85',
    },
    tags: ['LatteArt', 'Chempionat', 'VelourRoast'],
    isEvent: false,
  },
];

const CATEGORIES = [
  'Barchasi',
  'Mualliflik',
  'Espresso Bar',
  'Muzdek & Cold Brew',
  'Matcha & Choy',
  'Desertlar',
];

const PROMO_CODES = {
  VELOUR20: { discountPercent: 20, label: '20% kuzgi chegirma' },
  FIRSTCUP: { discountPercent: 15, label: 'Birinchi buyurtma uchun 15%' },
  BARISTA10: { discountPercent: 10, label: '10% doimiy mehmon bonusi' },
};

const MOOD_QUIZ_OPTIONS = [
  {
    id: 'energy',
    icon: '⚡',
    title: 'Maksimal energiya va fokus',
    desc: 'Ish yoki o‘qish oldidan kuchli tetiklik kerak',
    recommendedId: 'vr-104', // Kyoto Nitro Cold Brew
  },
  {
    id: 'sweet',
    icon: '🍯',
    title: 'Mayin, shirin va qaymoqli ta’m',
    desc: 'O‘zingizni shirin va noodatiy ichimlik bilan siylang',
    recommendedId: 'vr-102', // Tashkent Saffron Raf
  },
  {
    id: 'classic',
    icon: '☕',
    title: 'Muvozanatli klassik qahva',
    desc: 'Sut va espressoning sof uyg‘unligi',
    recommendedId: 'vr-101', // Velour Velvet Cortado
  },
  {
    id: 'fresh',
    icon: '🍊',
    title: 'Muzdek va sitrusli yangilik',
    desc: 'Yengil, tetiklantiruvchi va mevali notalar',
    recommendedId: 'vr-107', // Orange Espresso Tonic
  },
];

function App() {
  // Navigatsiya va Scroll holatlari
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('hero');

  // Menyu filtrlari va qidiruv
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'rating'
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeMoodId, setActiveMoodId] = useState('sweet');

  // Yangiliklar filtri
  const [selectedNewsTag, setSelectedNewsTag] = useState('Barchasi');

  // Savatcha, Sevimlilar va Sodiqlik ballari (LocalStorage bilan sinxron)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('velour_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('velour_favs_v1');
      return saved ? JSON.parse(saved) : ['vr-101', 'vr-102'];
    } catch {
      return ['vr-101', 'vr-102'];
    }
  });

  const [bookmarkedNewsIds, setBookmarkedNewsIds] = useState(() => {
    try {
      const saved = localStorage.getItem('velour_bookmarks_v1');
      return saved ? JSON.parse(saved) : ['news-01'];
    } catch {
      return ['news-01'];
    }
  });

  const [velourBeans, setVelourBeans] = useState(145);

  // Savatcha Drawer va Checkout holatlari
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('pickup'); // 'pickup' | 'delivery'
  const [selectedBranch, setSelectedBranch] = useState('Amir Temur shoh ko‘chasi, 48');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [orderSuccessReceipt, setOrderSuccessReceipt] = useState(null);

  // Stol band qilish formasi
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    guests: '2 kishi',
    date: '2026-11-14',
    time: '18:00',
    branch: 'Amir Temur filiali',
    zone: 'Deraza yonidagi sokin zona',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Toast bildirishnoma
  const [globalToast, setGlobalToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setGlobalToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setGlobalToast(null);
    }, 3000);
  };

  // LocalStorage ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem('velour_cart_v1', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('velour_favs_v1', JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem('velour_bookmarks_v1', JSON.stringify(bookmarkedNewsIds));
    } catch {}
  }, [bookmarkedNewsIds]);

  // Scroll kuzatuvchisi
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'menu', 'mood', 'journal', 'reserve'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveNav(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Savatchaga qo'shish funksiyasi
  const handleAddToCart = (customizedCoffee) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.cartKey === customizedCoffee.cartKey
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += customizedCoffee.quantity || 1;
        return updated;
      }
      return [...prev, { ...customizedCoffee, quantity: customizedCoffee.quantity || 1 }];
    });

    showToast(`"${customizedCoffee.name}" savatchaga qo‘shildi!`);
  };

  // Savatchadagi miqdorni o'zgartirish
  const updateCartQuantity = (cartKey, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Sevimlilarni boshqarish
  const handleToggleFavorite = (product) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`"${product.name}" sevimlilardan olindi`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`"${product.name}" sevimlilarga saqlandi! ❤️`);
        return [...prev, product.id];
      }
    });
  };

  // Yangiliklarni xatcho'pga saqlash
  const handleToggleNewsBookmark = (article) => {
    setBookmarkedNewsIds((prev) => {
      const exists = prev.includes(article.id);
      if (exists) {
        showToast('Maqola xatcho‘plardan olib tashlandi', 'info');
        return prev.filter((id) => id !== article.id);
      } else {
        showToast('Maqola keyin o‘qish uchun saqlandi! 🔖');
        return [...prev, article.id];
      }
    });
  };

  // Filtrlangan va saralangan kofelar ro'yxati
  const filteredCoffees = useMemo(() => {
    let list = [...COFFEE_CATALOG];

    if (selectedCategory !== 'Barchasi') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (onlyFavorites) {
      list = list.filter((c) => favoriteIds.includes(c.id));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.tastingNotes.some((n) => n.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [selectedCategory, onlyFavorites, favoriteIds, searchQuery, sortBy]);

  // Filtrlangan yangiliklar
  const filteredArticles = useMemo(() => {
    if (selectedNewsTag === 'Barchasi') return JOURNAL_ARTICLES;
    return JOURNAL_ARTICLES.filter((art) =>
      art.tags.some((t) => t.toLowerCase() === selectedNewsTag.toLowerCase())
    );
  }, [selectedNewsTag]);

  // Savatcha hisob-kitoblari
  const cartTotalCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems]
  );

  const deliveryFee = orderType === 'delivery' && cartSubtotal > 0 ? 15000 : 0;

  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((cartSubtotal * appliedPromo.discountPercent) / 100);
  }, [cartSubtotal, appliedPromo]);

  const finalPayable = Math.max(0, cartSubtotal - promoDiscount + deliveryFee);

  const formatMoney = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Promo-kodni tekshirish
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      setPromoError('');
      showToast(`Promo-kod "${code}" qo‘llanildi!`);
    } else {
      setPromoError('Noto‘g‘ri promo-kod. Sinab ko‘ring: VELOUR20');
    }
  };

  // Buyurtmani rasmiylashtirish
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const earned = Math.floor(finalPayable / 1000);
    setVelourBeans((prev) => prev + earned);

    const receipt = {
      orderNumber: `VR-${Math.floor(10000 + Math.random() * 90000)}`,
      itemsCount: cartTotalCount,
      total: finalPayable,
      earnedBeans: earned,
      mode: orderType === 'pickup' ? `Olib ketish (${selectedBranch})` : `Yetkazib berish (${deliveryAddress})`,
      eta: orderType === 'pickup' ? '10–15 daqiqa' : '30–40 daqiqa',
    };

    setOrderSuccessReceipt(receipt);
    setCartItems([]);
    setAppliedPromo(null);
    setPromoInput('');
  };

  // Stol band qilishni yuborish
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const code = `TBL-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingConfirmed({
      ...bookingForm,
      code,
    });
    showToast('Stol muvaffaqiyatli band qilindi!');
  };

  // Kayfiyat bo'yicha tavsiya etilgan qahva
  const recommendedMoodCoffee = useMemo(() => {
    const mood = MOOD_QUIZ_OPTIONS.find((m) => m.id === activeMoodId);
    return COFFEE_CATALOG.find((c) => c.id === mood?.recommendedId) || COFFEE_CATALOG[0];
  }, [activeMoodId]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="vr-app-shell">
      {/* Global Toast Bildirishnoma */}
      {globalToast && (
        <div className={`vr-global-toast is-${globalToast.type}`}>
          <span className="vr-toast-dot" />
          <span>{globalToast.message}</span>
        </div>
      )}

      {/* ==================== 1. HEADER / NAVBAR ==================== */}
      <header className={`vr-navbar ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="vr-container vr-nav-inner">
          <a
            href="#hero"
            className="vr-brand-logo"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
          >
            <div className="vr-logo-emblem">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <path d="M6 2v2M10 2v2M14 2v2" />
              </svg>
            </div>
            <div className="vr-logo-text">
              <strong>VelourRoast</strong>
              <span>SPECIALTY COFFEE</span>
            </div>
          </a>

          <nav className={`vr-nav-links ${mobileMenuOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className={activeNav === 'hero' ? 'active' : ''}
              onClick={() => scrollToSection('hero')}
            >
              Asosiy
            </button>
            <button
              type="button"
              className={activeNav === 'about' ? 'active' : ''}
              onClick={() => scrollToSection('about')}
            >
              Roastery
            </button>
            <button
              type="button"
              className={activeNav === 'menu' ? 'active' : ''}
              onClick={() => scrollToSection('menu')}
            >
              Menyu
            </button>
            <button
              type="button"
              className={activeNav === 'mood' ? 'active' : ''}
              onClick={() => scrollToSection('mood')}
            >
              Ta'm tanlovi
            </button>
            <button
              type="button"
              className={activeNav === 'journal' ? 'active' : ''}
              onClick={() => scrollToSection('journal')}
            >
              Yangiliklar
            </button>
            <button
              type="button"
              className={activeNav === 'reserve' ? 'active' : ''}
              onClick={() => scrollToSection('reserve')}
            >
              Stol band qilish
            </button>
          </nav>

          <div className="vr-nav-actions">
            {/* Sodiqlik ballari */}
            <div className="vr-beans-pill" title="Sizning Velour Beans sodiqlik ballaringiz">
              <span className="vr-bean-icon">🫘</span>
              <strong>{velourBeans}</strong>
              <span>Beans</span>
            </div>

            {/* Sevimlilar tugmasi */}
            <button
              type="button"
              className={`vr-nav-icon-btn ${onlyFavorites ? 'active' : ''}`}
              onClick={() => {
                setOnlyFavorites((prev) => !prev);
                scrollToSection('menu');
              }}
              title="Sevimli ichimliklar"
            >
              <svg
                viewBox="0 0 24 24"
                fill={favoriteIds.length > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favoriteIds.length > 0 && <span className="vr-count-dot">{favoriteIds.length}</span>}
            </button>

            {/* Savatcha tugmasi */}
            <button
              type="button"
              className="vr-cart-trigger"
              onClick={() => {
                setOrderSuccessReceipt(null);
                setCartOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="vr-cart-label">Savat</span>
              <span className="vr-cart-badge">{cartTotalCount}</span>
            </button>

            {/* Mobil burger menyu */}
            <button
              type="button"
              className="vr-burger-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Menyu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. HERO SECTION ==================== */}
      <section id="hero" className="vr-hero">
        <div className="vr-hero-ambient-orb orb-1" />
        <div className="vr-hero-ambient-orb orb-2" />

        <div className="vr-container vr-hero-grid">
          <div className="vr-hero-copy">
            <div className="vr-hero-eyebrow">
              <span className="vr-pulse-indicator" />
              <span>Toshkent • Mikro-lot Specialty Roastery</span>
            </div>

            <h1 className="vr-hero-title">
              Har bir qultumda <span className="vr-gold-gradient">san’at</span> va{' '}
              <span className="vr-gold-gradient">harorat</span> uyg‘unligi
            </h1>

            <p className="vr-hero-subtitle">
              VelourRoast — Efiopiya, Kolumbiya va Panama tog‘laridan keltirilgan 100% Specialty
              Arabica donlarini o‘z roasteriyamizda yangidan qovurib, siz uchun mualliflik
              ichimliklarini yaratamiz.
            </p>

            <div className="vr-hero-cta-group">
              <button
                type="button"
                className="vr-btn-primary"
                onClick={() => scrollToSection('menu')}
              >
                <span>Menyuni ko‘rish</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                className="vr-btn-secondary"
                onClick={() => scrollToSection('reserve')}
              >
                Stol band qilish
              </button>
            </div>

            <div className="vr-hero-metrics">
              <div className="vr-metric-item">
                <strong>88.5+</strong>
                <span>SCA Sifat Balli</span>
              </div>
              <div className="vr-metric-divider" />
              <div className="vr-metric-item">
                <strong>72 soat</strong>
                <span>Yangi qovurish sikli</span>
              </div>
              <div className="vr-metric-divider" />
              <div className="vr-metric-item">
                <strong>4.9 ★</strong>
                <span>2,400+ mamnun mehmon</span>
              </div>
            </div>
          </div>

          <div className="vr-hero-showcase">
            <div className="vr-hero-card-frame">
              {/* Jonli bug' (Steam) animatsiyasi */}
              <div className="vr-steam-wrapper" aria-hidden="true">
                <span className="vr-steam-line s1" />
                <span className="vr-steam-line s2" />
                <span className="vr-steam-line s3" />
              </div>

              <img
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1000&q=85"
                alt="VelourRoast Signature Latte Art"
                className="vr-hero-main-img"
              />

              {/* Suzuvchi Glassmorphic kartochkalar */}
              <div className="vr-float-badge top-left">
                <span className="vr-float-icon">🔥</span>
                <div>
                  <strong>Bugungi qovurish</strong>
                  <span>Ethiopia Guji • Medium</span>
                </div>
              </div>

              <div className="vr-float-badge bottom-right">
                <span className="vr-float-icon">🎁</span>
                <div>
                  <strong>Promo-kod: VELOUR20</strong>
                  <span>Barcha ichimliklarga -20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. ROASTERY FALSAFASI ==================== */}
      <section id="about" className="vr-philosophy-section">
        <div className="vr-container">
          <div className="vr-pillars-grid">
            <div className="vr-pillar-card">
              <div className="vr-pillar-num">01</div>
              <h3>To‘g‘ridan-to‘g‘ri fermerlardan</h3>
              <p>
                Biz faqat 1,700 metrdan baland tog‘li hududlarda yetishtirilgan va qo‘lda terilgan
                sara mikro-lot hosillarni tanlaymiz.
              </p>
            </div>

            <div className="vr-pillar-card">
              <div className="vr-pillar-num">02</div>
              <h3>Aniq harorat profili</h3>
              <p>
                Har bir don navi o‘zining tabiiy shokolad, rezavor yoki sitrus notalarini yo‘qotmasligi
                uchun raqamli nazorat ostida qovuriladi.
              </p>
            </div>

            <div className="vr-pillar-card">
              <div className="vr-pillar-num">03</div>
              <h3>5 bosqichli suv filtrlash</h3>
              <p>
                Qahvaning 98.5% qismi suvdan iborat. Biz ideal minerallar balansiga ega maxsus
                tozalangan suvdan foydalanamiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. ASOSIY MENYU (CoffeCard Grid) ==================== */}
      <section id="menu" className="vr-menu-section">
        <div className="vr-container">
          <div className="vr-section-head">
            <div>
              <span className="vr-section-kicker">VelourRoast Kolleksiyasi</span>
              <h2 className="vr-section-title">Mualliflik va Klassik Menyu</h2>
            </div>
            <p className="vr-section-desc">
              Har bir ichimlikni o‘z didingizga moslang: hajm, sut turi, tabiiy sirop va shakar
              miqdorini bevosita karta ichida tanlang.
            </p>
          </div>

          {/* Filtrlar va Qidiruv paneli */}
          <div className="vr-filter-toolbar">
            <div className="vr-category-tabs" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  className={`vr-cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOnlyFavorites(false);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="vr-search-sort-group">
              <div className="vr-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Qahva yoki ta'm izlash (masalan: karamel)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="vr-clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="vr-sort-select"
                aria-label="Saralash"
              >
                <option value="popular">Mashhurlik bo‘yicha</option>
                <option value="rating">Yuqori reyting (★)</option>
                <option value="price-asc">Arzonroqdan qimmatga</option>
                <option value="price-desc">Qimmatroqdan arzonga</option>
              </select>

              <button
                type="button"
                className={`vr-fav-filter-btn ${onlyFavorites ? 'active' : ''}`}
                onClick={() => setOnlyFavorites((prev) => !prev)}
              >
                ❤️ Sevimlilar ({favoriteIds.length})
              </button>
            </div>
          </div>

          {/* Kofelar Gridi */}
          {filteredCoffees.length === 0 ? (
            <div className="vr-empty-state">
              <span className="vr-empty-emoji">☕</span>
              <h3>Hech qanday ichimlik topilmadi</h3>
              <p>Qidiruv so‘zini o‘zgartirib ko‘ring yoki barcha kategoriyalarni tanlang.</p>
              <button
                type="button"
                className="vr-btn-primary"
                onClick={() => {
                  setSelectedCategory('Barchasi');
                  setSearchQuery('');
                  setOnlyFavorites(false);
                }}
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="vr-coffee-grid">
              {filteredCoffees.map((coffee, idx) => (
                <CoffeCard
                  key={coffee.id}
                  coffee={coffee}
                  index={idx}
                  isFavorite={favoriteIds.includes(coffee.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== 5. INTERAKTIV KAYFIYAT TAVSIYACHISI ==================== */}
      <section id="mood" className="vr-mood-section">
        <div className="vr-container">
          <div className="vr-mood-box">
            <div className="vr-mood-left">
              <span className="vr-section-kicker">Barista AI Sommelier</span>
              <h2>Bugun qanday ta’m kayfiyatingizga mos?</h2>
              <p>
                Hozirgi holatingizni tanlang — biz sizga ideal qahva retseptini tavsiya qilamiz.
              </p>

              <div className="vr-mood-options">
                {MOOD_QUIZ_OPTIONS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    className={`vr-mood-btn ${activeMoodId === mood.id ? 'active' : ''}`}
                    onClick={() => setActiveMoodId(mood.id)}
                  >
                    <span className="vr-mood-icon">{mood.icon}</span>
                    <div>
                      <strong>{mood.title}</strong>
                      <span>{mood.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="vr-mood-right">
              <div className="vr-recommended-tag">✨ Siz uchun ideal tanlov</div>
              <CoffeCard
                coffee={recommendedMoodCoffee}
                isFavorite={favoriteIds.includes(recommendedMoodCoffee.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. YANGILIKLAR VA JURNAL (NewsCard) ==================== */}
      <section id="journal" className="vr-journal-section">
        <div className="vr-container">
          <div className="vr-section-head">
            <div>
              <span className="vr-section-kicker">VelourRoast Jurnali</span>
              <h2 className="vr-section-title">Yangiliklar, Tadbirlar va Qahva Madaniyati</h2>
            </div>

            <div className="vr-news-filter-pills">
              {['Barchasi', 'VelourRoast', 'V60', 'YangiFilial', 'LatteArt'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`vr-tag-filter ${selectedNewsTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedNewsTag(tag)}
                >
                  {tag === 'Barchasi' ? 'Barcha maqolalar' : `#${tag}`}
                </button>
              ))}
            </div>
          </div>

          {/* Asosiy Featured Yangilik */}
          {filteredArticles.length > 0 && (
            <div className="vr-featured-news-wrap">
              <NewsCard
                article={filteredArticles[0]}
                featured={true}
                isBookmarked={bookmarkedNewsIds.includes(filteredArticles[0].id)}
                onToggleBookmark={handleToggleNewsBookmark}
                onSelectTag={(tag) => setSelectedNewsTag(tag)}
                index={0}
              />
            </div>
          )}

          {/* Qolgan yangiliklar gridi */}
          {filteredArticles.length > 1 && (
            <div className="vr-news-grid">
              {filteredArticles.slice(1).map((article, idx) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  featured={false}
                  isBookmarked={bookmarkedNewsIds.includes(article.id)}
                  onToggleBookmark={handleToggleNewsBookmark}
                  onSelectTag={(tag) => setSelectedNewsTag(tag)}
                  index={idx + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== 7. STOL BAND QILISH BO'LIMI ==================== */}
      <section id="reserve" className="vr-reserve-section">
        <div className="vr-container">
          <div className="vr-reserve-card">
            <div className="vr-reserve-info">
              <span className="vr-section-kicker">Mehmondo‘stlik</span>
              <h2>Qulay stolni oldindan band qiling</h2>
              <p>
                Do‘stlar bilan uchrashuv, ish yuzasidan muzokara yoki sokin kitob mutolaasi uchun
                o‘zingizga yoqqan zonani tanlang.
              </p>

              <div className="vr-branches-list">
                <div className="vr-branch-item">
                  <strong>📍 Amir Temur Roastery</strong>
                  <span>Amir Temur shoh ko‘chasi, 48 • 07:30 – 23:00</span>
                </div>
                <div className="vr-branch-item">
                  <strong>📍 Tashkent City Lounge</strong>
                  <span>Tashkent City bog‘i, 4-blok • 08:00 – 23:30</span>
                </div>
                <div className="vr-branch-item">
                  <strong>📍 Taras Shevchenko Espresso Bar</strong>
                  <span>Taras Shevchenko ko‘chasi, 21 • 07:00 – 22:30</span>
                </div>
              </div>
            </div>

            <div className="vr-reserve-form-wrap">
              {bookingConfirmed ? (
                <div className="vr-booking-success">
                  <div className="vr-success-check">✓</div>
                  <h3>Stolingiz band qilindi!</h3>
                  <p>
                    Band qilish kodi: <strong>{bookingConfirmed.code}</strong>
                  </p>
                  <div className="vr-booking-summary">
                    <span>👤 {bookingConfirmed.name}</span>
                    <span>📅 {bookingConfirmed.date} • {bookingConfirmed.time}</span>
                    <span>👥 {bookingConfirmed.guests}</span>
                    <span>📍 {bookingConfirmed.branch} ({bookingConfirmed.zone})</span>
                  </div>
                  <button
                    type="button"
                    className="vr-btn-secondary"
                    onClick={() => setBookingConfirmed(null)}
                  >
                    Yana boshqa stol band qilish
                  </button>
                </div>
              ) : (
                <form className="vr-booking-form" onSubmit={handleBookingSubmit}>
                  <div className="vr-form-row">
                    <div className="vr-input-group">
                      <label>Ismingiz</label>
                      <input
                        type="text"
                        required
                        placeholder="Masalan: Sardor"
                        value={bookingForm.name}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="vr-input-group">
                      <label>Telefon raqam</label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 (90) 123-45-67"
                        value={bookingForm.phone}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="vr-form-row three-cols">
                    <div className="vr-input-group">
                      <label>Mehmonlar</label>
                      <select
                        value={bookingForm.guests}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, guests: e.target.value })
                        }
                      >
                        <option>1 kishi</option>
                        <option>2 kishi</option>
                        <option>4 kishi</option>
                        <option>6+ kishi (VIP)</option>
                      </select>
                    </div>
                    <div className="vr-input-group">
                      <label>Sana</label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="vr-input-group">
                      <label>Vaqt</label>
                      <input
                        type="time"
                        value={bookingForm.time}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, time: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="vr-form-row">
                    <div className="vr-input-group">
                      <label>Filialni tanlang</label>
                      <select
                        value={bookingForm.branch}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, branch: e.target.value })
                        }
                      >
                        <option>Amir Temur filiali</option>
                        <option>Tashkent City Lounge</option>
                        <option>Taras Shevchenko Bar</option>
                      </select>
                    </div>
                    <div className="vr-input-group">
                      <label>Zona</label>
                      <select
                        value={bookingForm.zone}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, zone: e.target.value })
                        }
                      >
                        <option>Deraza yonidagi sokin zona</option>
                        <option>Kovorking (Rozetkali stol)</option>
                        <option>Ochiq yozgi terassa</option>
                        <option>Barista stoli (Brew Bar)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="vr-btn-primary full">
                    Stolni tasdiqlash
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. FOOTER ==================== */}
      <footer className="vr-footer">
        <div className="vr-container vr-footer-grid">
          <div className="vr-footer-brand">
            <div className="vr-logo-text">
              <strong>VelourRoast</strong>
              <span>SPECIALTY COFFEE & ROASTERY</span>
            </div>
            <p>
              2021-yildan beri Toshkentda specialty qahva madaniyatini rivojlantirib kelayotgan
              mustaqil qahvaxona va roasteriya.
            </p>
            <div className="vr-socials">
              <a href="#hero" onClick={(e) => e.preventDefault()}>Instagram</a>
              <a href="#hero" onClick={(e) => e.preventDefault()}>Telegram</a>
              <a href="#hero" onClick={(e) => e.preventDefault()}>YouTube</a>
            </div>
          </div>

          <div className="vr-footer-col">
            <h4>Bo‘limlar</h4>
            <button type="button" onClick={() => scrollToSection('about')}>Roastery haqida</button>
            <button type="button" onClick={() => scrollToSection('menu')}>Ichimliklar menyusi</button>
            <button type="button" onClick={() => scrollToSection('journal')}>Yangiliklar & Blog</button>
            <button type="button" onClick={() => scrollToSection('reserve')}>Stol band qilish</button>
          </div>

          <div className="vr-footer-col">
            <h4>Aloqa</h4>
            <span>📞 +998 (71) 200-48-48</span>
            <span>✉️ hello@velourroast.uz</span>
            <span>🕒 Har kuni: 07:30 – 23:30</span>
          </div>
        </div>

        <div className="vr-container vr-footer-bottom">
          <span>© 2026 VelourRoast Coffee Roasters. Barcha huquqlar himoyalangan.</span>
          <span>Promo-kodlar: VELOUR20 • FIRSTCUP</span>
        </div>
      </footer>

      {/* ==================== 9. SLIDE-OVER SAVATCHA (CART DRAWER) ==================== */}
      {cartOpen && (
        <div className="vr-drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="vr-cart-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Buyurtma savatchasi"
          >
            <div className="vr-drawer-header">
              <div>
                <h3>Sizning buyurtmangiz</h3>
                <span>{cartTotalCount} ta mahsulot tanlangan</span>
              </div>
              <button
                type="button"
                className="vr-close-modal-btn inline"
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>
            </div>

            {orderSuccessReceipt ? (
              <div className="vr-order-receipt">
                <div className="vr-receipt-icon">🎉</div>
                <h3>Buyurtmangiz qabul qilindi!</h3>
                <p>
                  Buyurtma raqami: <strong>{orderSuccessReceipt.orderNumber}</strong>
                </p>

                <div className="vr-receipt-card">
                  <div>
                    <span>Usul:</span>
                    <strong>{orderSuccessReceipt.mode}</strong>
                  </div>
                  <div>
                    <span>Tayyor bo‘lish vaqti:</span>
                    <strong>{orderSuccessReceipt.eta}</strong>
                  </div>
                  <div>
                    <span>To‘langan summa:</span>
                    <strong>{formatMoney(orderSuccessReceipt.total)} so‘m</strong>
                  </div>
                  <div className="vr-earned-row">
                    <span>Hisoblangan bonus:</span>
                    <strong>+{orderSuccessReceipt.earnedBeans} Velour Beans 🫘</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="vr-btn-primary full"
                  onClick={() => {
                    setOrderSuccessReceipt(null);
                    setCartOpen(false);
                  }}
                >
                  Ajoyib, rahmat!
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="vr-drawer-empty">
                <span>🛒</span>
                <h4>Savatchangiz hozircha bo‘sh</h4>
                <p>Menyudan o‘zingizga yoqqan qahva yoki desertni tanlang.</p>
                <button
                  type="button"
                  className="vr-btn-primary"
                  onClick={() => {
                    setCartOpen(false);
                    scrollToSection('menu');
                  }}
                >
                  Menyuga o‘tish
                </button>
              </div>
            ) : (
              <div className="vr-drawer-body">
                {/* Olib ketish / Yetkazib berish */}
                <div className="vr-delivery-switch">
                  <button
                    type="button"
                    className={orderType === 'pickup' ? 'active' : ''}
                    onClick={() => setOrderType('pickup')}
                  >
                    🏃 O‘zim olib ketaman
                  </button>
                  <button
                    type="button"
                    className={orderType === 'delivery' ? 'active' : ''}
                    onClick={() => setOrderType('delivery')}
                  >
                    🛵 Yetkazib berish
                  </button>
                </div>

                {/* Savatchadagi mahsulotlar ro'yxati */}
                <div className="vr-cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.cartKey} className="vr-cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="vr-cart-item-info">
                        <strong>{item.name}</strong>
                        <span className="vr-cart-item-specs">
                          {item.selectedSize} ({item.volumeText}) •{' '}
                          {item.temperature === 'iced' ? 'Muzdek' : 'Issiq'}
                          {item.selectedMilk ? ` • ${item.selectedMilk}` : ''}
                          {item.selectedSyrup ? ` • ${item.selectedSyrup}` : ''}
                          {item.doubleShot ? ' • +Extra Shot' : ''}
                        </span>
                        {item.baristaNote && (
                          <em className="vr-cart-item-note">“{item.baristaNote}”</em>
                        )}
                        <div className="vr-cart-item-bottom">
                          <span className="vr-cart-item-price">
                            {formatMoney(item.unitPrice * item.quantity)} so‘m
                          </span>

                          <div className="vr-mini-stepper">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.cartKey, -1)}
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.cartKey, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo-kod */}
                <form className="vr-promo-form" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    placeholder="Promo-kod (masalan: VELOUR20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button type="submit">Qo‘llash</button>
                </form>
                {promoError && <p className="vr-promo-error">{promoError}</p>}
                {appliedPromo && (
                  <p className="vr-promo-ok">
                    ✅ {appliedPromo.code} ({appliedPromo.label}) qo‘llanildi!
                  </p>
                )}

                {/* Checkout formasi */}
                <form className="vr-checkout-form" onSubmit={handleCheckoutSubmit}>
                  {orderType === 'pickup' ? (
                    <div className="vr-input-group">
                      <label>Qaysi filialdan olasiz?</label>
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                      >
                        <option>Amir Temur shoh ko‘chasi, 48</option>
                        <option>Tashkent City Lounge, 4-blok</option>
                        <option>Taras Shevchenko ko‘chasi, 21</option>
                      </select>
                    </div>
                  ) : (
                    <div className="vr-input-group">
                      <label>Yetkazib berish manzili</label>
                      <input
                        type="text"
                        required
                        placeholder="Ko'cha, uy, xonadon..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="vr-input-group">
                    <label>Telefon raqamingiz</label>
                    <input
                      type="tel"
                      required
                      placeholder="+998 (__) ___-__-__"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  {/* Hisob-kitob */}
                  <div className="vr-summary-lines">
                    <div>
                      <span>Mahsulotlar:</span>
                      <span>{formatMoney(cartSubtotal)} so‘m</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="discount">
                        <span>Chegirma ({appliedPromo.code}):</span>
                        <span>-{formatMoney(promoDiscount)} so‘m</span>
                      </div>
                    )}
                    {deliveryFee > 0 && (
                      <div>
                        <span>Yetkazib berish:</span>
                        <span>{formatMoney(deliveryFee)} so‘m</span>
                      </div>
                    )}
                    <div className="total">
                      <span>Jami to‘lov:</span>
                      <strong>{formatMoney(finalPayable)} so‘m</strong>
                    </div>
                  </div>

                  <button type="submit" className="vr-btn-primary full">
                    Buyurtmani tasdiqlash • {formatMoney(finalPayable)} so‘m
                  </button>
                </form>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;