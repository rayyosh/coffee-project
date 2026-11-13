import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * VelourRoast - Specialty Coffee Shop Mahsulot Kartasi Komponenti
 * Arxitektura: Senior Frontend Pattern (Zero external dependencies, Pure React + CSS Motion)
 * Xususiyatlari:
 * - 3D Perspektiva va sichqoncha koordinatasiga bog'langan Magnetic Glow effekti
 * - 4 xil hajm (S, M, L, XL), sut alternativalari, siroplar va muz darajasi tanlovi
 * - Ta'm profili (Shirinlik, Kislotalilik, To'yinganlik) vizual ko'rsatkichlari
 * - Velour Beans sodiqlik ballarini avtomatik hisoblash
 * - Chuqur sozlash va kelib chiqish tarixini ko'rsatuvchi Quick-View Modali
 */

const CUP_SIZES = {
  S: { code: 'S', label: 'Kichik', ml: '240 ml', extraCost: 0, calScale: 0.8 },
  M: { code: 'M', label: "O'rta", ml: '340 ml', extraCost: 5000, calScale: 1.0 },
  L: { code: 'L', label: 'Katta', ml: '450 ml', extraCost: 10000, calScale: 1.3 },
  XL: { code: 'XL', label: 'Grand', ml: '550 ml', extraCost: 15000, calScale: 1.55 },
};

const MILK_TYPES = [
  { id: 'whole', title: 'Tabiiy sut 3.2%', cost: 0, kcal: 0 },
  { id: 'oat', title: 'Barista Oat (Suli)', cost: 7000, kcal: 18 },
  { id: 'almond', title: 'Bodom suti', cost: 8000, kcal: -12 },
  { id: 'coconut', title: 'Kokos suti', cost: 8000, kcal: 22 },
  { id: 'soy', title: 'Soya suti', cost: 6000, kcal: -5 },
  { id: 'none', title: 'Sutsiz (Qora)', cost: 0, kcal: -45 },
];

const ARTISAN_SYRUPS = [
  { id: 'none', title: 'Siropsiz', cost: 0, kcal: 0 },
  { id: 'salted_caramel', title: 'Tuzli Karamel', cost: 5000, kcal: 52 },
  { id: 'madagascar_vanilla', title: 'Madagaskar Vanili', cost: 5000, kcal: 46 },
  { id: 'roasted_hazelnut', title: "Qovurilgan Funduk", cost: 5500, kcal: 50 },
  { id: 'lavender_honey', title: 'Lavanda & Asal', cost: 6000, kcal: 42 },
  { id: 'white_mocha', title: 'Oq Shokolad', cost: 6000, kcal: 64 },
];

const ICE_LEVELS = [
  { id: 'no_ice', label: 'Muzsiz' },
  { id: 'less_ice', label: 'Kam muz' },
  { id: 'regular_ice', label: 'Normal' },
  { id: 'extra_ice', label: "Ko'p muz" },
];

const CoffeCard = ({
  coffee,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  index = 0,
  currency = "so'm",
}) => {
  // Ichimlik sozlamalari holatlari
  const [size, setSize] = useState('M');
  const [milk, setMilk] = useState('whole');
  const [syrup, setSyrup] = useState('none');
  const [temp, setTemp] = useState(coffee?.defaultTemp || 'hot');
  const [iceLevel, setIceLevel] = useState('regular_ice');
  const [sugarPercent, setSugarPercent] = useState(50);
  const [doubleShot, setDoubleShot] = useState(false);
  const [whippedCream, setWhippedCream] = useState(false);
  const [baristaNote, setBaristaNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Interaktiv UI va animatsiya holatlari
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('customize'); // 'customize' | 'origin'
  const [addingState, setAddingState] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // 3D Perspektiva va Glow kuzatuvi
  const cardElementRef = useRef(null);
  const [cardTransform, setCardTransform] = useState({
    transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)',
    transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
  });
  const [glowCoords, setGlowCoords] = useState({ x: 50, y: 50, visible: false });

  // Mahsulot ma'lumotlarini normalizatsiya qilish
  const product = useMemo(() => {
    return {
      id: coffee?.id || `vr-${Math.random().toString(36).slice(2, 9)}`,
      name: coffee?.name || 'Velour Velvet Cortado',
      tagline: coffee?.tagline || '100% Specialty Arabica • Mikro-lot',
      description:
        coffee?.description ||
        "Efiopiya Guji va Kolumbiya Huila tog' yonbag'irlaridan terilgan sara donlarning ipakdek mayin sut ko'pigi bilan uyg'unligi.",
      price: coffee?.price || 32000,
      oldPrice: coffee?.oldPrice || null,
      image:
        coffee?.image ||
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=85',
      category: coffee?.category || 'Mualliflik',
      badge: coffee?.badge || null,
      rating: coffee?.rating || 4.9,
      reviews: coffee?.reviews || 164,
      roast: coffee?.roast || 3, // 1..5
      caffeine: coffee?.caffeine || 155,
      calories: coffee?.calories || 135,
      prepMinutes: coffee?.prepMinutes || '3-5 daq',
      inStock: coffee?.inStock !== undefined ? coffee.inStock : true,
      allowMilk: coffee?.allowMilk !== undefined ? coffee.allowMilk : true,
      allowIce: coffee?.allowIce !== undefined ? coffee.allowIce : true,
      tastingNotes: coffee?.tastingNotes || ['Qora shokolad', 'Qovurilgan bodom', 'Karamel'],
      tasteProfile: coffee?.tasteProfile || {
        sweetness: 75,
        acidity: 45,
        body: 85,
      },
      origin: coffee?.origin || {
        region: 'Yirgacheffe, Efiopiya',
        altitude: '1,950 - 2,150 m',
        process: 'Washed (Yuvilgan usul)',
        harvest: '2026 Bahorgi hosil',
      },
    };
  }, [coffee]);

  // Bir dona ichimlikning yakuniy narxini hisoblash
  const unitPrice = useMemo(() => {
    let sum = product.price;
    sum += CUP_SIZES[size]?.extraCost || 0;

    if (product.allowMilk) {
      const mObj = MILK_TYPES.find((m) => m.id === milk);
      sum += mObj ? mObj.cost : 0;
    }

    const sObj = ARTISAN_SYRUPS.find((s) => s.id === syrup);
    sum += sObj ? sObj.cost : 0;

    if (doubleShot) sum += 7000;
    if (whippedCream) sum += 5000;

    return sum;
  }, [product.price, product.allowMilk, size, milk, syrup, doubleShot, whippedCream]);

  // Jami narx (miqdor bilan)
  const totalOrderPrice = unitPrice * quantity;

  // Sodiqlik ballari (har 1000 so'm uchun 1 Velour Bean)
  const earnedBeans = Math.floor(totalOrderPrice / 1000);

  // Kaloriya hisobi
  const calculatedCalories = useMemo(() => {
    const scale = CUP_SIZES[size]?.calScale || 1;
    let kcal = Math.round(product.calories * scale);

    if (product.allowMilk) {
      const mObj = MILK_TYPES.find((m) => m.id === milk);
      kcal += mObj ? mObj.kcal : 0;
    }

    const sObj = ARTISAN_SYRUPS.find((s) => s.id === syrup);
    kcal += sObj ? sObj.kcal : 0;

    if (doubleShot) kcal += 8;
    if (whippedCream) kcal += 75;
    kcal += Math.round((sugarPercent / 100) * 45);

    return Math.max(5, kcal);
  }, [product.calories, product.allowMilk, size, milk, syrup, doubleShot, whippedCream, sugarPercent]);

  // Chegirma foizi
  const discountPercentage = useMemo(() => {
    if (!product.oldPrice || product.oldPrice <= product.price) return null;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }, [product.oldPrice, product.price]);

  const formatMoney = (val) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // 3D Tilt harakati
  const handlePointerMove = (e) => {
    if (!cardElementRef.current || modalOpen) return;
    const bounds = cardElementRef.current.getBoundingClientRect();
    const relX = e.clientX - bounds.left;
    const relY = e.clientY - bounds.top;

    const midX = bounds.width / 2;
    const midY = bounds.height / 2;

    const rotX = ((relY - midY) / midY) * -5.5;
    const rotY = ((relX - midX) / midX) * 5.5;

    setCardTransform({
      transform: `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
        2
      )}deg) translateY(-4px)`,
      transition: 'transform 0.08s ease-out',
    });

    setGlowCoords({
      x: (relX / bounds.width) * 100,
      y: (relY / bounds.height) * 100,
      visible: true,
    });
  };

  const handlePointerEnter = () => {
    setHovered(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setCardTransform({
      transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
    });
    setGlowCoords((prev) => ({ ...prev, visible: false }));
  };

  // Escape tugmasi bilan modalni yopish
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      window.addEventListener('keydown', onEsc);
    }
    return () => window.removeEventListener('keydown', onEsc);
  }, [modalOpen]);

  // Savatchaga qo'shish
  const triggerAddToCart = (e, closeAfter = false) => {
    if (e) e.stopPropagation();
    if (!product.inStock || addingState === 'loading') return;

    setAddingState('loading');

    const selectedMilkObj = MILK_TYPES.find((m) => m.id === milk);
    const selectedSyrupObj = ARTISAN_SYRUPS.find((s) => s.id === syrup);
    const selectedIceObj = ICE_LEVELS.find((i) => i.id === iceLevel);

    const payload = {
      ...product,
      cartKey: `${product.id}_${size}_${milk}_${syrup}_${temp}_${iceLevel}_${sugarPercent}_${doubleShot}_${whippedCream}_${baristaNote}`,
      selectedSize: size,
      volumeText: CUP_SIZES[size]?.ml,
      selectedMilk: product.allowMilk ? selectedMilkObj?.title : null,
      selectedSyrup: selectedSyrupObj?.id !== 'none' ? selectedSyrupObj?.title : null,
      temperature: product.allowIce ? temp : 'hot',
      iceOption: temp === 'iced' ? selectedIceObj?.label : null,
      sugarPercent,
      doubleShot,
      whippedCream,
      baristaNote: baristaNote.trim(),
      unitPrice,
      calories: calculatedCalories,
      quantity,
    };

    setTimeout(() => {
      if (onAddToCart) {
        onAddToCart(payload);
      }
      setAddingState('success');

      setTimeout(() => {
        setAddingState('idle');
        if (closeAfter) {
          setModalOpen(false);
          setQuantity(1);
        }
      }, 1100);
    }, 320);
  };

  // Qovurish darajasi donachalari
  const renderBeanRoast = (level) => (
    <div className="vr-roast-meter" title={`Qovurish darajasi: ${level}/5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className={`vr-bean-dot ${step <= level ? 'is-filled' : ''}`}
        />
      ))}
    </div>
  );

  return (
    <>
      <article
        ref={cardElementRef}
        className={`vr-coffee-card ${hovered ? 'is-hovered' : ''} ${
          !product.inStock ? 'is-unavailable' : ''
        }`}
        style={{
          ...cardTransform,
          animationDelay: `${index * 0.07}s`,
        }}
        onMouseMove={handlePointerMove}
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
      >
        {/* Sichqoncha harakatiga bog'langan Magnetic Glow */}
        <div
          className="vr-card-glow"
          style={{
            background: `radial-gradient(300px circle at ${glowCoords.x}% ${glowCoords.y}%, rgba(217, 155, 82, 0.18), transparent 75%)`,
            opacity: glowCoords.visible ? 1 : 0,
          }}
        />

        {/* Rasm bloki */}
        <div className="vr-card-visual" onClick={() => setModalOpen(true)}>
          {!imgLoaded && !imgFailed && (
            <div className="vr-skeleton-box">
              <div className="vr-skeleton-wave" />
            </div>
          )}

          <img
            src={
              imgFailed
                ? 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85'
                : product.image
            }
            alt={product.name}
            className={`vr-card-photo ${imgLoaded ? 'is-ready' : ''}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgFailed(true);
              setImgLoaded(true);
            }}
          />

          <div className="vr-visual-vignette" />

          {/* Yuqori chap badgelar */}
          <div className="vr-badge-stack">
            {product.badge && (
              <span className="vr-pill-badge vr-pill-primary">{product.badge}</span>
            )}
            {discountPercentage && (
              <span className="vr-pill-badge vr-pill-sale">-{discountPercentage}%</span>
            )}
            {!product.inStock && (
              <span className="vr-pill-badge vr-pill-out">Vaqtincha tugagan</span>
            )}
          </div>

          {/* Yuqori o'ng tugmalar */}
          <div className="vr-floating-tools">
            <button
              type="button"
              className={`vr-circle-tool ${isFavorite ? 'is-fav' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(product);
              }}
              aria-label="Sevimlilarga qo'shish"
              title={isFavorite ? 'Sevimlilardan olish' : "Sevimlilarga qo'shish"}
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            <button
              type="button"
              className="vr-circle-tool"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              aria-label="Chuqur sozlash"
              title="Retseptni sozlash"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>
          </div>

          {/* Pastki reyting va tayyorlash vaqti */}
          <div className="vr-visual-bottom">
            <div className="vr-glass-chip">
              <span className="vr-star-icon">★</span>
              <strong>{product.rating}</strong>
              <span className="vr-muted-num">({product.reviews})</span>
            </div>

            <div className="vr-glass-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{product.prepMinutes}</span>
            </div>
          </div>
        </div>

        {/* Asosiy ma'lumot qismi */}
        <div className="vr-card-content">
          <div className="vr-meta-header">
            <span className="vr-cat-label">{product.category}</span>
            <div className="vr-roast-group">
              <span>Qovurish:</span>
              {renderBeanRoast(product.roast)}
            </div>
          </div>

          <h3 className="vr-product-title" onClick={() => setModalOpen(true)}>
            {product.name}
          </h3>

          <p className="vr-product-tagline">{product.tagline}</p>

          {/* Ta'm notalari */}
          <div className="vr-notes-list">
            {product.tastingNotes.slice(0, 3).map((note, idx) => (
              <span key={idx} className="vr-note-pill">
                {note}
              </span>
            ))}
          </div>

          {/* Hajm va Harorat boshqaruvi */}
          <div className="vr-quick-config">
            <div className="vr-size-strip" role="group" aria-label="Finjon hajmi">
              {Object.keys(CUP_SIZES).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`vr-size-chip ${size === key ? 'active' : ''}`}
                  onClick={() => setSize(key)}
                  title={`${CUP_SIZES[key].label} (${CUP_SIZES[key].ml})`}
                >
                  <span className="vr-sz-code">{key}</span>
                  <span className="vr-sz-ml">{CUP_SIZES[key].ml}</span>
                </button>
              ))}
            </div>

            {product.allowIce && (
              <div className="vr-temp-switch" role="group" aria-label="Ichimlik harorati">
                <button
                  type="button"
                  className={`vr-temp-opt ${temp === 'hot' ? 'active hot' : ''}`}
                  onClick={() => setTemp('hot')}
                  title="Issiq"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`vr-temp-opt ${temp === 'iced' ? 'active iced' : ''}`}
                  onClick={() => setTemp('iced')}
                  title="Muzdek"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Karta pastki narx va savatcha qismi */}
          <div className="vr-card-bottom">
            <div className="vr-price-area">
              {product.oldPrice && (
                <span className="vr-price-strike">
                  {formatMoney(product.oldPrice)} {currency}
                </span>
              )}
              <div className="vr-price-main">
                <strong>{formatMoney(unitPrice)}</strong>
                <span>{currency}</span>
              </div>
              <span className="vr-nutrition-line">
                {calculatedCalories} kkal • +{Math.floor(unitPrice / 1000)} Beans
              </span>
            </div>

            <button
              type="button"
              disabled={!product.inStock || addingState === 'loading'}
              className={`vr-order-btn ${addingState !== 'idle' ? `is-${addingState}` : ''}`}
              onClick={(e) => triggerAddToCart(e, false)}
            >
              {!product.inStock ? (
                <span>Tugagan</span>
              ) : addingState === 'loading' ? (
                <span className="vr-loader-ring" />
              ) : addingState === 'success' ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Qo‘shildi</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Savatga</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* CHUQUR SOZLASH VA KELIB CHIQISH MODALI */}
      {modalOpen && (
        <div
          className="vr-overlay-backdrop"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`vr-modal-heading-${product.id}`}
        >
          <div className="vr-customizer-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vr-close-modal-btn"
              onClick={() => setModalOpen(false)}
              aria-label="Yopish"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="vr-modal-layout">
              {/* Chap ustun: Rasm, Ta'm profili va Ko'rsatkichlar */}
              <div className="vr-modal-left">
                <div className="vr-modal-poster">
                  <img src={product.image} alt={product.name} />
                  {product.badge && <span className="vr-poster-tag">{product.badge}</span>}
                </div>

                {/* Ta'm profili shkalalari */}
                <div className="vr-taste-bars-box">
                  <h4>Ta'm profili (Barista bahosi)</h4>

                  <div className="vr-bar-row">
                    <span>Shirinlik</span>
                    <div className="vr-bar-track">
                      <div
                        className="vr-bar-fill"
                        style={{ width: `${product.tasteProfile.sweetness}%` }}
                      />
                    </div>
                    <strong>{product.tasteProfile.sweetness}%</strong>
                  </div>

                  <div className="vr-bar-row">
                    <span>Kislotalilik</span>
                    <div className="vr-bar-track">
                      <div
                        className="vr-bar-fill"
                        style={{ width: `${product.tasteProfile.acidity}%` }}
                      />
                    </div>
                    <strong>{product.tasteProfile.acidity}%</strong>
                  </div>

                  <div className="vr-bar-row">
                    <span>To‘yinganlik</span>
                    <div className="vr-bar-track">
                      <div
                        className="vr-bar-fill"
                        style={{ width: `${product.tasteProfile.body}%` }}
                      />
                    </div>
                    <strong>{product.tasteProfile.body}%</strong>
                  </div>
                </div>

                <div className="vr-mini-metrics">
                  <div>
                    <span>Kofein</span>
                    <strong>{doubleShot ? product.caffeine + 65 : product.caffeine} mg</strong>
                  </div>
                  <div>
                    <span>Kaloriya</span>
                    <strong>{calculatedCalories} kkal</strong>
                  </div>
                  <div>
                    <span>Bonus</span>
                    <strong>+{earnedBeans} Beans</strong>
                  </div>
                </div>
              </div>

              {/* O'ng ustun: Barcha sozlamalar */}
              <div className="vr-modal-right">
                <div className="vr-modal-intro">
                  <span className="vr-modal-kicker">
                    {product.category} • VelourRoast Barista Lab
                  </span>
                  <h2 id={`vr-modal-heading-${product.id}`}>{product.name}</h2>
                  <p>{product.description}</p>
                </div>

                <div className="vr-modal-nav">
                  <button
                    type="button"
                    className={modalTab === 'customize' ? 'active' : ''}
                    onClick={() => setModalTab('customize')}
                  >
                    Ichimlikni yig‘ish
                  </button>
                  <button
                    type="button"
                    className={modalTab === 'origin' ? 'active' : ''}
                    onClick={() => setModalTab('origin')}
                  >
                    Don kelib chiqishi
                  </button>
                </div>

                {modalTab === 'customize' ? (
                  <div className="vr-builder-scroll">
                    {/* 1. Hajm */}
                    <div className="vr-field-block">
                      <label className="vr-field-title">1. Finjon hajmi</label>
                      <div className="vr-chip-grid">
                        {Object.entries(CUP_SIZES).map(([key, itemSize]) => (
                          <button
                            key={key}
                            type="button"
                            className={`vr-select-pill ${size === key ? 'active' : ''}`}
                            onClick={() => setSize(key)}
                          >
                            <strong>{itemSize.code}</strong> • {itemSize.ml}
                            {itemSize.extraCost > 0 && (
                              <em> +{formatMoney(itemSize.extraCost)}</em>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Harorat va Muz */}
                    {product.allowIce && (
                      <div className="vr-field-block">
                        <label className="vr-field-title">2. Harorat va Muz miqdori</label>
                        <div className="vr-chip-grid">
                          <button
                            type="button"
                            className={`vr-select-pill ${temp === 'hot' ? 'active' : ''}`}
                            onClick={() => setTemp('hot')}
                          >
                            🔥 Issiq (65°C)
                          </button>
                          <button
                            type="button"
                            className={`vr-select-pill ${temp === 'iced' ? 'active' : ''}`}
                            onClick={() => setTemp('iced')}
                          >
                            ❄️ Muzdek (Iced)
                          </button>
                        </div>

                        {temp === 'iced' && (
                          <div className="vr-chip-grid sub-row">
                            {ICE_LEVELS.map((ice) => (
                              <button
                                key={ice.id}
                                type="button"
                                className={`vr-select-pill sm ${iceLevel === ice.id ? 'active' : ''}`}
                                onClick={() => setIceLevel(ice.id)}
                              >
                                {ice.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. Sut turi */}
                    {product.allowMilk && (
                      <div className="vr-field-block">
                        <label className="vr-field-title">3. Sut asosi</label>
                        <div className="vr-chip-grid">
                          {MILK_TYPES.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              className={`vr-select-pill ${milk === m.id ? 'active' : ''}`}
                              onClick={() => setMilk(m.id)}
                            >
                              {m.title}
                              {m.cost > 0 && <em> +{formatMoney(m.cost)}</em>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Sirop */}
                    <div className="vr-field-block">
                      <label className="vr-field-title">4. Tabiiy sirop qo‘shish</label>
                      <div className="vr-chip-grid">
                        {ARTISAN_SYRUPS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className={`vr-select-pill ${syrup === s.id ? 'active' : ''}`}
                            onClick={() => setSyrup(s.id)}
                          >
                            {s.title}
                            {s.cost > 0 && <em> +{formatMoney(s.cost)}</em>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. Shakar va Qo'shimchalar */}
                    <div className="vr-field-block">
                      <label className="vr-field-title">
                        5. Shirinlik darajasi: <strong>{sugarPercent}%</strong>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="25"
                        value={sugarPercent}
                        onChange={(e) => setSugarPercent(Number(e.target.value))}
                        className="vr-slider"
                      />
                    </div>

                    <div className="vr-addons-pair">
                      <label className={`vr-addon-toggle ${doubleShot ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={doubleShot}
                          onChange={(e) => setDoubleShot(e.target.checked)}
                        />
                        <div>
                          <strong>+1 Extra Espresso Shot</strong>
                          <span>+7 000 {currency} • +65 mg kofein</span>
                        </div>
                      </label>

                      <label className={`vr-addon-toggle ${whippedCream ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={whippedCream}
                          onChange={(e) => setWhippedCream(e.target.checked)}
                        />
                        <div>
                          <strong>Qaymoqli krem (Whipped)</strong>
                          <span>+5 000 {currency} • Mayin ustki qatlam</span>
                        </div>
                      </label>
                    </div>

                    {/* 6. Baristaga eslatma */}
                    <div className="vr-field-block">
                      <label className="vr-field-title">6. Baristaga maxsus izoh (ixtiyoriy)</label>
                      <input
                        type="text"
                        maxLength={90}
                        placeholder="Masalan: ustiga dolchin (koritsa) sepib bering..."
                        value={baristaNote}
                        onChange={(e) => setBaristaNote(e.target.value)}
                        className="vr-note-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="vr-origin-panel">
                    <div className="vr-origin-grid">
                      <div className="vr-origin-card">
                        <span>Mintaqa (Origin)</span>
                        <strong>{product.origin.region}</strong>
                      </div>
                      <div className="vr-origin-card">
                        <span>Balandlik (Altitude)</span>
                        <strong>{product.origin.altitude}</strong>
                      </div>
                      <div className="vr-origin-card">
                        <span>Qayta ishlash usuli</span>
                        <strong>{product.origin.process}</strong>
                      </div>
                      <div className="vr-origin-card">
                        <span>Hosil mavsumi</span>
                        <strong>{product.origin.harvest}</strong>
                      </div>
                    </div>

                    <div className="vr-origin-story">
                      <h4>Qovurish falsafasi</h4>
                      <p>
                        VelourRoast roasteriyasida har bir kichik partiya Loring Smart Roaster
                        uskunasida harorat egri chizig‘i ostida nazorat qilinadi. Bu donning
                        tabiiy mevali va shokoladli notalarini kuyib ketmasdan ochib beradi.
                      </p>
                    </div>
                  </div>
                )}

                {/* Modal pastki buyurtma paneli */}
                <div className="vr-modal-actions">
                  <div className="vr-qty-stepper">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Kamaytirish"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      aria-label="Oshirish"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="vr-confirm-order-btn"
                    onClick={(e) => triggerAddToCart(e, true)}
                  >
                    Savatga qo‘shish • {formatMoney(totalOrderPrice)} {currency}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoffeCard;