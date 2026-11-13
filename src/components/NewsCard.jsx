import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * VelourRoast - Yangiliklar, Tadbirlar va Qahva Jurnali Komponenti
 * Xususiyatlari:
 * - Featured (Asosiy maqola) va Standard (Grid karta) moslashuvchan maketi
 * - Reader Mode Modali: Jonli o'qish progress-bari, shrift o'lchamini boshqarish
 * - Tadbirlar uchun ichki RSVP (Joy band qilish) interaktiv formasi
 * - Layk hisoblagichi, xatcho'plarga saqlash va havolani nusxalash xabarnomasi
 * - Maqola ostida jonli muhokama va fikr qoldirish tizimi
 */

const NewsCard = ({
  article,
  featured = false,
  isBookmarked = false,
  onToggleBookmark,
  onSelectTag,
  index = 0,
}) => {
  // Karta va Modal holatlari
  const [readerOpen, setReaderOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article?.likes || 68);
  const [shareToast, setShareToast] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Reader modal ichidagi boshqaruv holatlari
  const [readProgress, setReadProgress] = useState(0);
  const [textScale, setTextScale] = useState(1); // 0.9, 1, 1.15
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');

  // Izohlar tizimi
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentsList, setCommentsList] = useState(
    article?.comments || [
      {
        id: 'vr-c1',
        user: 'Kamronbek Tursunov',
        badge: 'Specialty Lover',
        date: '3 soat oldin',
        message:
          "VelourRoast roasteriyasida yangi qovurilgan Kolumbiya Geisha donlarini tatib ko'rdim — ta'mi va ifori haqiqiy san'at asari!",
      },
      {
        id: 'vr-c2',
        user: 'Nilufar Karimova',
        badge: 'Doimiy mehmon',
        date: 'Kecha, 18:40',
        message:
          "Shanba kungi Latte Art workshopiga albatta boraman. O'tgan safargi dars juda foydali bo'lgandi.",
      },
    ]
  );

  const scrollContainerRef = useRef(null);

  // Maqola ma'lumotlarini xavfsiz normalizatsiya qilish
  const item = useMemo(() => {
    return {
      id: article?.id || `vr-news-${Math.random().toString(36).slice(2, 9)}`,
      title:
        article?.title ||
        'VelourRoast kuzgi mikro-lot kolleksiyasi va yangi V60 damlash texnikasini taqdim etdi',
      summary:
        article?.summary ||
        "Bizning bosh roasterlarimiz Efiopiya Guji va Panama Boquete hududlaridan keltirilgan sara hosil donlarini maxsus harorat profilida qovurib, kuzgi mavsum uchun yangi ta'm palitrasini yaratdilar.",
      paragraphs: article?.paragraphs || [
        "Har bir finjon mukammal qahva ortida yuzlab soatlik tajriba, to'g'ri tanlangan suv mineralizatsiyasi va aniq harorat nazorati yotadi. VelourRoast jamoasi kuzgi mavsum oldidan o'zining yangi 'Velvet Harvest' mikro-lot kolleksiyasini taqdim etdi.",
        "Ushbu kolleksiyadagi donlar anaerobik fermentatsiya usulida qayta ishlangan bo'lib, ularda yovvoyi rezavorlar, bergamot, qora shokolad va qovurilgan funduk notalari yaqqol seziladi. Ayniqsa V60 va Chemex muqobil damlash usullarida bu ta'mlar yanada chuqurroq ochiladi.",
        "Bundan tashqari, har hafta juma va shanba kunlari Toshkentdagi markaziy filialimizda ochiq 'Coffee Cupping & Latte Art' mahorat darslari tashkil etilmoqda. Mehmonlar professional baristalar bilan birga qahva ekstraksiyasi sirlarini amalda sinab ko'rishlari mumkin.",
        "Velour Beans sodiqlik dasturi ishtirokchilari uchun yangi mavsumiy ichimliklarga dastlabki o'n kun davomida ikki barobar bonus ballari taqdim etiladi.",
      ],
      category: article?.category || 'Roastery Jurnali',
      publishedAt: article?.publishedAt || '13 Noyabr, 2026',
      readDuration: article?.readDuration || '5 daqiqa',
      viewsCount: article?.viewsCount || 1240,
      image:
        article?.image ||
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1100&q=85',
      author: {
        name: article?.author?.name || 'Saidakbar',
        title: article?.author?.title || 'Asoschi & Q-Grader Roaster',
        avatar:
          article?.author?.avatar ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=85',
      },
      tags: article?.tags || ['VelourRoast', 'Specialty', 'V60', 'MikroLot'],
      isEvent: article?.isEvent || false,
      eventSchedule: article?.eventSchedule || 'Shanba, 16:00 • Markaziy filial',
      branchAddress: article?.branchAddress || 'Toshkent sh., Amir Temur shoh ko‘chasi, 48-uy',
      keyTakeaways: article?.keyTakeaways || [
        '100% Specialty Arabica mikro-lot donlari har 72 soatda yangidan qovuriladi',
        'V60 va Aeropress usullari uchun maxsus suv filtrlash tizimi joriy etildi',
        'Velour Beans a’zolari uchun barcha yangi ichimliklarga +2x bonus ballari',
      ],
    };
  }, [article]);

  // Escape tugmasi bilan modalni yopish
  useEffect(() => {
    const handleEscPress = (e) => {
      if (e.key === 'Escape' && readerOpen) {
        setReaderOpen(false);
      }
    };
    if (readerOpen) {
      window.addEventListener('keydown', handleEscPress);
      setReadProgress(0);
    }
    return () => window.removeEventListener('keydown', handleEscPress);
  }, [readerOpen]);

  // Reader ichidagi scroll progress-barni hisoblash
  const handleArticleScroll = () => {
    const node = scrollContainerRef.current;
    if (!node) return;
    const scrolled = node.scrollTop;
    const maxScroll = node.scrollHeight - node.clientHeight;
    if (maxScroll <= 0) {
      setReadProgress(100);
      return;
    }
    const percentage = Math.min(100, Math.max(0, (scrolled / maxScroll) * 100));
    setReadProgress(percentage);
  };

  // Layk bosish
  const toggleLike = (e) => {
    e.stopPropagation();
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((cnt) => (next ? cnt + 1 : cnt - 1));
      return next;
    });
  };

  // Xatcho'pga saqlash
  const handleBookmark = (e) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(item);
    }
  };

  // Havolani nusxalash
  const handleCopyLink = (e) => {
    e.stopPropagation();
    const link = `${window.location.origin}/#journal-${item.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2200);
  };

  // Tadbirga yozilish (RSVP)
  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) return;
    setRsvpSubmitted(true);
  };

  // Yangi izoh qo'shish
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const entry = {
      id: `vr-c-${Date.now()}`,
      user: commentAuthor.trim() || 'Mehmon o‘quvchi',
      badge: 'Velour Community',
      date: 'Hozirgina',
      message: newComment.trim(),
    };

    setCommentsList((prev) => [entry, ...prev]);
    setNewComment('');
    setCommentAuthor('');
  };

  const bodyBlocks = Array.isArray(item.paragraphs)
    ? item.paragraphs
    : String(item.paragraphs).split('\n\n');

  return (
    <>
      <article
        className={`vr-news-card ${featured ? 'is-featured' : 'is-grid-card'}`}
        style={{ animationDelay: `${index * 0.09}s` }}
        onClick={() => setReaderOpen(true)}
      >
        {/* Rasm qismi */}
        <div className="vr-news-cover">
          {!photoReady && !photoError && (
            <div className="vr-skeleton-box">
              <div className="vr-skeleton-wave" />
            </div>
          )}

          <img
            src={
              photoError
                ? 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1100&q=85'
                : item.image
            }
            alt={item.title}
            className={`vr-news-photo ${photoReady ? 'is-ready' : ''}`}
            loading="lazy"
            onLoad={() => setPhotoReady(true)}
            onError={() => {
              setPhotoError(true);
              setPhotoReady(true);
            }}
          />

          <div className="vr-news-shade" />

          {/* Yuqori kategoriya va harakat tugmalari */}
          <div className="vr-news-overlay-top">
            <span className="vr-news-cat-badge">{item.category}</span>

            <div className="vr-news-quick-btns">
              <button
                type="button"
                className={`vr-circle-tool sm ${isBookmarked ? 'is-bookmarked' : ''}`}
                onClick={handleBookmark}
                title={isBookmarked ? 'Saqlanganlardan olish' : 'Xatcho‘pga saqlash'}
                aria-label="Xatcho'pga saqlash"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              <button
                type="button"
                className="vr-circle-tool sm"
                onClick={handleCopyLink}
                title="Havolani nusxalash"
                aria-label="Ulashish"
              >
                {shareToast ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Tadbir belgisi */}
          {item.isEvent && (
            <div className="vr-event-ribbon">
              <span className="vr-live-dot" />
              <span>{item.eventSchedule}</span>
            </div>
          )}
        </div>

        {/* Matn va ma'lumotlar qismi */}
        <div className="vr-news-body">
          <div className="vr-news-meta-line">
            <span>{item.publishedAt}</span>
            <span className="vr-dot-sep">•</span>
            <span>{item.readDuration} o‘qish</span>
            <span className="vr-dot-sep">•</span>
            <span>👁 {item.viewsCount}</span>
          </div>

          <h3 className="vr-news-heading">{item.title}</h3>

          <p className="vr-news-summary">{item.summary}</p>

          {/* Teglar */}
          <div className="vr-news-tag-strip">
            {item.tags.slice(0, featured ? 4 : 3).map((tag, idx) => (
              <button
                key={idx}
                type="button"
                className="vr-tag-chip"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectTag) onSelectTag(tag);
                }}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Pastki muallif va o'qish tugmasi */}
          <div className="vr-news-footer">
            <div className="vr-author-box">
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="vr-author-pic"
              />
              <div className="vr-author-meta">
                <strong>{item.author.name}</strong>
                <span>{item.author.title}</span>
              </div>
            </div>

            <div className="vr-news-actions-row">
              <button
                type="button"
                className={`vr-like-pill ${isLiked ? 'active' : ''}`}
                onClick={toggleLike}
                aria-label="Yoqtirish"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{likeCount}</span>
              </button>

              <span className="vr-read-cta">
                <span>Batafsil</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {shareToast && (
          <div className="vr-toast-pill">Maqola havolasi nusxalandi!</div>
        )}
      </article>

      {/* TO'LIQ MAQOLA O'QISH MODALI (READER MODAL) */}
      {readerOpen && (
        <div
          className="vr-overlay-backdrop"
          onClick={() => setReaderOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`vr-article-title-${item.id}`}
        >
          <div className="vr-reader-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Scroll progress-bari */}
            <div className="vr-progress-rail">
              <div
                className="vr-progress-indicator"
                style={{ width: `${readProgress}%` }}
              />
            </div>

            {/* Reader Toolbar */}
            <div className="vr-reader-header-bar">
              <div className="vr-reader-badges">
                <span className="vr-news-cat-badge">{item.category}</span>
                <span className="vr-read-stat">👁 {item.viewsCount} ko‘rish</span>
              </div>

              <div className="vr-reader-tools">
                <div className="vr-font-sizer" title="Matn kattaligi">
                  <button
                    type="button"
                    className={textScale === 0.9 ? 'active' : ''}
                    onClick={() => setTextScale(0.9)}
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    className={textScale === 1 ? 'active' : ''}
                    onClick={() => setTextScale(1)}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    className={textScale === 1.15 ? 'active' : ''}
                    onClick={() => setTextScale(1.15)}
                  >
                    A+
                  </button>
                </div>

                <button
                  type="button"
                  className={`vr-circle-tool sm ${isBookmarked ? 'is-bookmarked' : ''}`}
                  onClick={handleBookmark}
                  title="Saqlash"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="vr-close-modal-btn inline"
                  onClick={() => setReaderOpen(false)}
                  aria-label="Yopish"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Maqola o'qish hududi */}
            <div
              ref={scrollContainerRef}
              className="vr-reader-body-scroll"
              onScroll={handleArticleScroll}
            >
              <div className="vr-reader-top">
                <h1 id={`vr-article-title-${item.id}`} className="vr-reader-main-title">
                  {item.title}
                </h1>

                <div className="vr-reader-author-strip">
                  <div className="vr-author-box">
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="vr-author-pic lg"
                    />
                    <div className="vr-author-meta">
                      <strong>{item.author.name}</strong>
                      <span>
                        {item.author.title} • {item.publishedAt} • {item.readDuration}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`vr-like-pill lg ${isLiked ? 'active' : ''}`}
                    onClick={toggleLike}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{likeCount} Yoqdi</span>
                  </button>
                </div>

                <div className="vr-reader-banner-img">
                  <img src={item.image} alt={item.title} />
                </div>
              </div>

              {/* Asosiy xulosalar qutisi */}
              {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                <div className="vr-takeaways-card">
                  <h4>Asosiy jihatlar:</h4>
                  <ul>
                    {item.keyTakeaways.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Maqola matni */}
              <div
                className="vr-reader-prose"
                style={{ fontSize: `${textScale}rem` }}
              >
                <p className="vr-prose-lead">{item.summary}</p>

                {bodyBlocks.map((block, idx) => (
                  <p key={idx}>{block}</p>
                ))}

                <blockquote className="vr-prose-quote">
                  “Qahva — bu shoshilmaslik san’ati. Har bir finjon ortida quyosh nuri, tog‘ havosi
                  va roaster mahorati mujassam.”
                  <cite>— {item.author.name}, VelourRoast Roastery</cite>
                </blockquote>
              </div>

              {/* Agar tadbir bo'lsa, RSVP joy band qilish formasi */}
              {item.isEvent && (
                <div className="vr-event-rsvp-box">
                  <div className="vr-rsvp-info">
                    <span className="vr-rsvp-badge">Ochiq Tadbir • Bepul kirish</span>
                    <h3>Tadbirda ishtirok etish uchun joy band qiling</h3>
                    <p>
                      📅 <strong>Vaqt:</strong> {item.eventSchedule} <br />
                      📍 <strong>Manzil:</strong> {item.branchAddress}
                    </p>
                  </div>

                  {rsvpSubmitted ? (
                    <div className="vr-rsvp-confirmed">
                      ✅ Rahmat, <strong>{rsvpName}</strong>! Joyingiz muvaffaqiyatli band qilindi.
                      Tadbirdan 2 soat oldin SMS eslatma yuboramiz.
                    </div>
                  ) : (
                    <form className="vr-rsvp-form" onSubmit={handleRsvpSubmit}>
                      <input
                        type="text"
                        required
                        placeholder="Ismingiz"
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                      />
                      <input
                        type="tel"
                        required
                        placeholder="+998 (__) ___-__-__"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                      />
                      <button type="submit">Joy band qilish</button>
                    </form>
                  )}
                </div>
              )}

              {/* Izohlar va muhokama bo'limi */}
              <div className="vr-comments-section">
                <h3>O‘quvchilar fikrlari ({commentsList.length})</h3>

                <form className="vr-comment-composer" onSubmit={handleAddComment}>
                  <input
                    type="text"
                    placeholder="Ismingiz (ixtiyoriy)"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="vr-comment-name-input"
                  />
                  <textarea
                    rows="3"
                    required
                    placeholder="Ushbu maqola yoki qahva haqida fikringizni yozing..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="vr-post-comment-btn">
                    Izoh qoldirish
                  </button>
                </form>

                <div className="vr-comment-feed">
                  {commentsList.map((c) => (
                    <div key={c.id} className="vr-comment-card">
                      <div className="vr-comment-top">
                        <div>
                          <strong>{c.user}</strong>
                          <span className="vr-comment-tag">{c.badge}</span>
                        </div>
                        <span className="vr-comment-date">{c.date}</span>
                      </div>
                      <p>{c.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsCard;