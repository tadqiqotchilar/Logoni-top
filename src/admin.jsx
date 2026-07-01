import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Trash2, 
  Edit, 
  Upload, 
  LogOut, 
  Lock, 
  Check, 
  Settings, 
  AlertCircle,
  ChevronDown,
  Globe,
  Plus
} from 'lucide-react';
import { LogoSvg } from './LogoSvg.jsx';
import './admin.css';

const DEFAULT_COUNTRIES = [
  { id: 'uzbekistan', name: "O'zbekiston", code: 'uz', region: "O'RTA OSIYO" },
  { id: 'kazakhstan', name: "Qozog'iston", code: 'kz', region: "O'RTA OSIYO" },
  { id: 'kyrgyzstan', name: "Qirg'iziston", code: 'kg', region: "O'RTA OSIYO" },
  { id: 'tajikistan', name: "Tojikiston", code: 'tj', region: "O'RTA OSIYO" },
  { id: 'france', name: "Fransiya", code: 'fr', region: "EVROPA" },
  { id: 'germany', name: "Germaniya", code: 'de', region: "EVROPA" },
  { id: 'poland', name: "Polsha", code: 'pl', region: "EVROPA" },
  { id: 'turkey', name: "Turkiya", code: 'tr', region: "EVROPA" },
  { id: 'usa', name: "Amerika", code: 'us', region: "SHIMOLIY VA JANUBIY AMERIKA" },
  { id: 'canada', name: "Canada", code: 'ca', region: "SHIMOLIY VA JANUBIY AMERIKA" },
  { id: 'mexico', name: "Meksika", code: 'mx', region: "SHIMOLIY VA JANUBIY AMERIKA" },
  { id: 'argentina', name: "Argentina", code: 'ar', region: "SHIMOLIY VA JANUBIY AMERIKA" }
];

const ALL_WORLD_COUNTRIES = [
  { code: 'uz', name: "O'zbekiston" },
  { code: 'kz', name: "Qozog'iston" },
  { code: 'kg', name: "Qirg'iziston" },
  { code: 'tj', name: "Tojikiston" },
  { code: 'tm', name: "Turkmaniston" },
  { code: 'ru', name: "Rossiya" },
  { code: 'tr', name: "Turkiya" },
  { code: 'de', name: "Germaniya" },
  { code: 'fr', name: "Fransiya" },
  { code: 'it', name: "Italiya" },
  { code: 'es', name: "Ispaniya" },
  { code: 'gb', name: "Buyuk Britaniya" },
  { code: 'pl', name: "Polsha" },
  { code: 'ua', name: "Ukraina" },
  { code: 'us', name: "Amerika Qo'shma Shtatlari" },
  { code: 'ca', name: "Kanada" },
  { code: 'mx', name: "Meksika" },
  { code: 'ar', name: "Argentina" },
  { code: 'br', name: "Braziliya" },
  { code: 'cn', name: "Xitoy" },
  { code: 'jp', name: "Yaponiya" },
  { code: 'kr', name: "Janubiy Koreya" },
  { code: 'ae', name: "BAA (Birlashgan Arab Amirligi)" },
  { code: 'sa', name: "Saudiya Arabistoni" },
  { code: 'eg', name: "Misr" },
  { code: 'in', name: "Hindiston" },
  { code: 'au', name: "Avstraliya" },
  { code: 'az', name: "Ozarbayjon" },
  { code: 'ge', name: "Gruziya" },
  { code: 'am', name: "Armaniston" },
  { code: 'by', name: "Belarus" },
  { code: 'ir', name: "Eron" },
  { code: 'iq', name: "Iroq" },
  { code: 'pk', name: "Pokiston" },
  { code: 'af', name: "Afg'oniston" },
  { code: 'ch', name: "Shveysariya" },
  { code: 'nl', name: "Niderlandiya" },
  { code: 'be', name: "Belgiya" },
  { code: 'se', name: "Shvetsiya" },
  { code: 'no', name: "Norvegiya" },
  { code: 'fi', name: "Finlandiya" },
  { code: 'dk', name: "Daniya" },
  { code: 'at', name: "Avstriya" },
  { code: 'pt', name: "Portugaliya" },
  { code: 'gr', name: "Gretsiya" },
  { code: 'qa', name: "Qatar" },
  { code: 'my', name: "Malayziya" },
  { code: 'sg', name: "Singapur" },
  { code: 'id', name: "Indoneziya" },
  { code: 'th', name: "Tailand" },
  { code: 'vn', name: "Vyetnam" },
  { code: 'za', name: "Janubiy Afrika" },
  { code: 'ma', name: "Marokash" }
];

// Image compression helper using HTML5 canvas
const compressImage = (file, maxWidth = 300, maxHeight = 300) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('logo_quiz_admin_logged') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [customLevels, setCustomLevels] = useState(() => {
    const saved = localStorage.getItem('logo_quiz_custom_levels');
    return saved ? JSON.parse(saved) : [];
  });

  const [customCountries, setCustomCountries] = useState(() => {
    const saved = localStorage.getItem('logo_quiz_custom_countries');
    return saved ? JSON.parse(saved) : [];
  });

  const allCountries = [...DEFAULT_COUNTRIES, ...customCountries];
  const countryCodes = allCountries.reduce((acc, c) => ({ ...acc, [c.id]: c.code }), {});
  const countryList = allCountries;

  const allLevels = customLevels;

  // Form states
  const [editLevelId, setEditLevelId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formCountry, setFormCountry] = useState('uzbekistan');
  const [formDesc, setFormDesc] = useState('');
  const [formImagePartial, setFormImagePartial] = useState('');
  const [formImageFull, setFormImageFull] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  const [isWorldCountryDropdownOpen, setIsWorldCountryDropdownOpen] = useState(false);
  const worldCountryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (worldCountryDropdownRef.current && !worldCountryDropdownRef.current.contains(event.target)) {
        setIsWorldCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Country Form states
  const [selectedWorldCountry, setSelectedWorldCountry] = useState(null);
  const [countryFormRegion, setCountryFormRegion] = useState("O'RTA OSIYO");
  const [isCustomRegion, setIsCustomRegion] = useState(false);
  const [countryFormError, setCountryFormError] = useState('');
  const [countryFormSuccess, setCountryFormSuccess] = useState('');

  // Auto-hide country success message
  useEffect(() => {
    if (countryFormSuccess) {
      const timer = setTimeout(() => setCountryFormSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [countryFormSuccess]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('logo_quiz_admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError('Parol noto\'g\'ri! Qaytadan urinib ko\'ring.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('logo_quiz_admin_logged');
    setPassword('');
  };

  const handleFormNameChange = (e) => {
    const val = e.target.value;
    setFormName(val);
    const derivedAnswer = val.toUpperCase().replace(/[^A-Z]/g, '');
    setFormAnswer(derivedAnswer);
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImage(file);
      if (type === 'partial') {
        setFormImagePartial(compressedBase64);
      } else {
        setFormImageFull(compressedBase64);
      }
      setFormError('');
    } catch (err) {
      console.error(err);
      setFormError('Rasmni siqishda yoki yuklashda xatolik yuz berdi.');
    }
  };

  const handleOpenEdit = (level) => {
    setEditLevelId(level.id);
    setFormName(level.name);
    setFormAnswer(level.answer);
    setFormCategory(level.category || '');
    setFormCountry(level.country || 'uzbekistan');
    setFormDesc(level.desc || '');
    setFormImagePartial(level.imagePartial);
    setFormImageFull(level.imageFull);
    setFormError('');
    setSuccessMessage('');
  };

  const handleClearForm = () => {
    setEditLevelId(null);
    setFormName('');
    setFormAnswer('');
    setFormCategory('');
    setFormCountry('uzbekistan');
    setFormDesc('');
    setFormImagePartial('');
    setFormImageFull('');
    setFormError('');
  };

  const handleDeleteLevel = (id) => {
    if (window.confirm("Haqiqatan ham ushbu logotipni o'chirmoqchimisiz?")) {
      const nextCustomLevels = customLevels.filter(lvl => lvl.id !== id);
      setCustomLevels(nextCustomLevels);
      localStorage.setItem('logo_quiz_custom_levels', JSON.stringify(nextCustomLevels));

      // Remove from solved list if it was solved
      const savedSolved = localStorage.getItem('logo_quiz_solved');
      if (savedSolved) {
        const solvedList = JSON.parse(savedSolved);
        if (solvedList.includes(id)) {
          const nextSolved = solvedList.filter(sId => sId !== id);
          localStorage.setItem('logo_quiz_solved', JSON.stringify(nextSolved));
        }
      }

      setSuccessMessage('Logotip muvaffaqiyatli o\'chirildi.');
      if (editLevelId === id) {
        handleClearForm();
      }
    }
  };

  const handleSaveLevel = (e) => {
    e.preventDefault();

    if (!formImagePartial || !formImageFull) {
      setFormError("Ikkala rasmni ham yuklash shart (chala va to'liq ko'rinish).");
      return;
    }

    if (!formAnswer) {
      setFormError("Javob maydoni bo'sh bo'lishi mumkin emas.");
      return;
    }

    const levelData = {
      id: editLevelId || `custom_${Date.now()}`,
      name: formName,
      answer: formAnswer.toUpperCase(),
      category: formCategory,
      country: formCountry,
      desc: formDesc,
      imagePartial: formImagePartial,
      imageFull: formImageFull,
      isCustom: true
    };

    let nextCustomLevels;
    if (editLevelId) {
      nextCustomLevels = customLevels.map(lvl => lvl.id === editLevelId ? levelData : lvl);
      setSuccessMessage('Logotip muvaffaqiyatli tahrirlandi.');
    } else {
      nextCustomLevels = [...customLevels, levelData];
      setSuccessMessage('Yangi logotip muvaffaqiyatli qo\'shildi.');
    }

    setCustomLevels(nextCustomLevels);
    localStorage.setItem('logo_quiz_custom_levels', JSON.stringify(nextCustomLevels));
    handleClearForm();
  };

  const handleSaveCountry = (e) => {
    e.preventDefault();

    if (!selectedWorldCountry) {
      setCountryFormError("Iltimos, ro'yxatdan davlatni tanlang.");
      return;
    }

    const newId = selectedWorldCountry.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if ID already exists
    if (allCountries.some(c => c.id === newId)) {
      setCountryFormError(`${selectedWorldCountry.name} allaqachon qo'shilgan.`);
      return;
    }

    const finalRegion = countryFormRegion.trim().toUpperCase() || "O'RTA OSIYO";

    const newCountry = {
      id: newId,
      name: selectedWorldCountry.name,
      code: selectedWorldCountry.code,
      region: finalRegion
    };

    const nextCountries = [...customCountries, newCountry];
    setCustomCountries(nextCountries);
    localStorage.setItem('logo_quiz_custom_countries', JSON.stringify(nextCountries));

    // Reset Form
    setSelectedWorldCountry(null);
    setCountryFormRegion("O'RTA OSIYO");
    setIsCustomRegion(false);
    setCountryFormError('');
    setCountryFormSuccess("Yangi davlat muvaffaqiyatli qo'shildi!");
  };

  const handleClearAllData = () => {
    if (window.confirm("DIQQAT! Barcha maxsus logotiplar va qo'shilgan maxsus davlatlar o'chiriladi. Jadval butunlay bo'sh bo'ladi. Tasdiqlaysizmi?")) {
      setCustomLevels([]);
      setCustomCountries([]);
      localStorage.removeItem('logo_quiz_custom_levels');
      localStorage.removeItem('logo_quiz_custom_countries');
      localStorage.removeItem('logo_quiz_solved');
      setSuccessMessage("Barcha ma'lumotlar (va davlatlar) tozalandi.");
      handleClearForm();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon-container">
              <Settings size={28} className="spin-slow" />
            </div>
            <h2>Admin Tizimi</h2>
            <p>Uzbek Logo Quiz boshqaruv paneliga kirish</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="pass">Parol</label>
              <input 
                type="password" 
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn-login">Kirish</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <Settings size={24} />
          <h1>Uzbek Logo Quiz <span>Admin Panel</span></h1>
        </div>
        <div className="header-actions">
          <span className="stats-badge">Darajalar: {allLevels.length} ta</span>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Chiqish
          </button>
        </div>
      </header>

      {successMessage && (
        <div className="success-toast pop-in-toast">
          <Check size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      <main className="dashboard-main">
        {/* Left Pane: Levels List */}
        <section className="dashboard-pane list-pane">
          <div className="pane-header">
            <h2>Mavjud Darajalar</h2>
            <div className="pane-header-actions">
              <button className="btn-reset-all" onClick={handleClearAllData}>
                Barcha ma'lumotlarni tozalash
              </button>
            </div>
          </div>

          <div className="levels-table-container">
            <table className="levels-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Logotip</th>
                  <th>Nomi</th>
                  <th>Turkumi</th>
                  <th>Mamlakat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {allLevels.map((lvl, index) => (
                  <tr key={lvl.id} className={editLevelId === lvl.id ? 'active-row' : ''}>
                    <td className="col-num">{index + 1}</td>
                    <td className="col-img">
                      <div className="table-img-preview">
                        {lvl.isCustom ? (
                          <img src={lvl.imageFull} alt={lvl.name} />
                        ) : (
                          <LogoSvg brandId={lvl.id} isSolved={true} />
                        )}
                      </div>
                    </td>
                    <td className="col-name">
                      <strong>{lvl.name}</strong>
                      <span className="col-answer">{lvl.answer}</span>
                    </td>
                    <td className="col-cat">
                      <div className="table-cat-text">{lvl.category || '—'}</div>
                    </td>
                    <td className="col-country">
                      <span className="table-country-badge">
                        <img 
                          src={`https://flagcdn.com/w40/${countryCodes[lvl.country || 'uzbekistan']}.png`} 
                          alt={lvl.country || 'uzbekistan'} 
                          className="admin-table-flag" 
                        />
                        {(lvl.country || 'uzbekistan').toUpperCase()}
                      </span>
                    </td>
                    <td className="col-actions">
                      {lvl.isCustom ? (
                        <div className="actions-group">
                          <button 
                            className="btn-action-edit" 
                            title="Tahrirlash"
                            onClick={() => handleOpenEdit(lvl)}
                          >
                            <Edit size={14} /> Tahrirlash
                          </button>
                          <button 
                            className="btn-action-delete" 
                            title="O'chirish"
                            onClick={() => handleDeleteLevel(lvl.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="system-lock"><Lock size={12} /> Himoyalangan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Pane: Add/Edit Form */}
        <section className="dashboard-pane form-pane">
          <div className="country-form-card" style={{ marginTop: 0, marginBottom: '24px' }}>
            <div className="card-header-sub">
              <Globe size={18} />
              <h3>Yangi Davlat Qo'shish</h3>
            </div>
            
            <form onSubmit={handleSaveCountry} className="country-mini-form">
              <div className="form-row">
                <div className="form-field" ref={worldCountryDropdownRef}>
                  <label>Davlatni Tanlang</label>
                  <div className="custom-select-wrapper">
                    <button 
                      type="button"
                      className="custom-select-trigger"
                      onClick={() => setIsWorldCountryDropdownOpen(!isWorldCountryDropdownOpen)}
                    >
                      {selectedWorldCountry ? (
                        <div className="select-trigger-content">
                          <img 
                            src={`https://flagcdn.com/w40/${selectedWorldCountry.code}.png`} 
                            alt={selectedWorldCountry.name} 
                            className="select-trigger-flag"
                          />
                          <span>{selectedWorldCountry.name}</span>
                        </div>
                      ) : (
                        <span className="select-placeholder">Tanlang...</span>
                      )}
                      <ChevronDown size={16} className={`select-trigger-arrow ${isWorldCountryDropdownOpen ? 'open' : ''}`} />
                    </button>

                    {isWorldCountryDropdownOpen && (
                      <div className="custom-select-options">
                        {ALL_WORLD_COUNTRIES.map((country) => (
                          <div 
                            key={country.code}
                            className={`custom-select-option ${selectedWorldCountry?.code === country.code ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedWorldCountry(country);
                              setIsWorldCountryDropdownOpen(false);
                            }}
                          >
                            <img 
                              src={`https://flagcdn.com/w40/${country.code}.png`} 
                              alt={country.name} 
                              className="select-option-flag"
                            />
                            <span>{country.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label>Qit'a / Hudud</label>
                  {isCustomRegion ? (
                    <div className="input-with-cancel">
                      <input 
                        type="text" 
                        value={countryFormRegion} 
                        onChange={(e) => setCountryFormRegion(e.target.value)} 
                        placeholder="Masalan: OSIYO, AFRIKA"
                        required
                      />
                      <button type="button" className="btn-cancel-custom" onClick={() => {
                        setIsCustomRegion(false);
                        setCountryFormRegion("O'RTA OSIYO");
                      }}>Bekor</button>
                    </div>
                  ) : (
                    <select 
                      value={countryFormRegion} 
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setIsCustomRegion(true);
                          setCountryFormRegion('');
                        } else {
                          setCountryFormRegion(e.target.value);
                        }
                      }}
                      className="desktop-select-simple"
                    >
                      <option value="O'RTA OSIYO">O'RTA OSIYO</option>
                      <option value="EVROPA">EVROPA</option>
                      <option value="SHIMOLIY VA JANUBIY AMERIKA">SHIMOLIY VA JANUBIY AMERIKA</option>
                      {Array.from(new Set(customCountries.map(c => c.region)))
                        .filter(r => !["O'RTA OSIYO", "EVROPA", "SHIMOLIY VA JANUBIY AMERIKA"].includes(r))
                        .map(r => <option key={r} value={r}>{r}</option>)
                      }
                      <option value="__new__">+ Yangi hudud...</option>
                    </select>
                  )}
                </div>
              </div>
              
              {countryFormError && <div className="form-error-msg">{countryFormError}</div>}
              {countryFormSuccess && <div className="form-success-msg">{countryFormSuccess}</div>}
              
              <button type="submit" className="btn-submit-country">
                <Plus size={14} /> Davlat Qo'shish
              </button>
            </form>
          </div>

          <div className="pane-header">
            <h2>{editLevelId ? 'Logotipni Tahrirlash' : 'Yangi Logotip Qo\'shish'}</h2>
            {editLevelId && (
              <button className="btn-cancel-edit" onClick={handleClearForm}>
                Yangi qo'shish rejimiga qaytish
              </button>
            )}
          </div>

          <form onSubmit={handleSaveLevel} className="desktop-form">
            {formError && (
              <div className="form-error-banner">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-field">
                <label>Brend Nomi</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={handleFormNameChange}
                  placeholder="Masalan: Anorbank, Uzcard"
                  required
                />
              </div>

              <div className="form-field">
                <label>O'yin Javobi (Faqat lotincha A-Z harflari)</label>
                <input 
                  type="text" 
                  value={formAnswer} 
                  onChange={(e) => setFormAnswer(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  placeholder="Masalan: ANORBANK, UZCARD"
                  required
                />
                <span className="field-hint">Bo'shliqlarsiz, faqat klaviaturada teriladigan A-Z harflari.</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Turkumi (Kategoriya)</label>
                <input 
                  type="text" 
                  value={formCategory} 
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Masalan: Bank, Moliya, Oziq-ovqat"
                />
              </div>

              <div className="form-field" ref={countryDropdownRef}>
                <label>Mamlakat (Kategoriya bo'yicha)</label>
                <div className="custom-select-wrapper">
                  <button 
                    type="button"
                    className="custom-select-trigger"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  >
                    <div className="select-trigger-content">
                      <img 
                        src={`https://flagcdn.com/w40/${countryCodes[formCountry]}.png`} 
                        alt={formCountry} 
                        className="select-trigger-flag"
                      />
                      <span>{countryList.find(c => c.id === formCountry)?.name || formCountry}</span>
                    </div>
                    <ChevronDown size={16} className={`select-trigger-arrow ${isCountryDropdownOpen ? 'open' : ''}`} />
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="custom-select-options">
                      {countryList.map((country) => (
                        <div 
                          key={country.id}
                          className={`custom-select-option ${formCountry === country.id ? 'selected' : ''}`}
                          onClick={() => {
                            setFormCountry(country.id);
                            setIsCountryDropdownOpen(false);
                          }}
                        >
                          <img 
                            src={`https://flagcdn.com/w40/${countryCodes[country.id]}.png`} 
                            alt={country.name} 
                            className="select-option-flag"
                          />
                          <span>{country.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>Kompaniya haqida qisqacha tavsif (Description)</label>
              <textarea 
                value={formDesc} 
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Logotip to'g'ri topilgandan keyin ko'rsatiladigan tarixiy/ma'lumotiy qisqacha matn..."
                rows={3}
              />
            </div>

            {/* Images Upload Area */}
            <div className="form-upload-section">
              <div className="upload-container">
                <label className="upload-label">1. Chala/Yashirilgan logotip ko'rinishi (O'yin payti uchun)</label>
                <div className="desktop-upload-box">
                  {formImagePartial ? (
                    <div className="preview-container">
                      <img src={formImagePartial} alt="Chala ko'rinish" />
                      <button type="button" className="btn-remove-preview" onClick={() => setFormImagePartial('')}>
                        O'chirish
                      </button>
                    </div>
                  ) : (
                    <label className="upload-input-trigger">
                      <Upload size={32} />
                      <span>Rasm tanlang (JPEG, PNG)</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'partial')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="upload-container">
                <label className="upload-label">2. To'liq logotip ko'rinishi (Yechilgandan keyin)</label>
                <div className="desktop-upload-box">
                  {formImageFull ? (
                    <div className="preview-container">
                      <img src={formImageFull} alt="To'liq ko'rinish" />
                      <button type="button" className="btn-remove-preview" onClick={() => setFormImageFull('')}>
                        O'chirish
                      </button>
                    </div>
                  ) : (
                    <label className="upload-input-trigger">
                      <Upload size={32} />
                      <span>Rasm tanlang (JPEG, PNG)</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'full')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="form-submit-row">
              <button 
                type="button" 
                className="btn-desktop-secondary" 
                onClick={handleClearForm}
              >
                Tozalash
              </button>
              <button type="submit" className="btn-desktop-primary">
                {editLevelId ? 'O\'zgarishlarni Saqlash' : 'Darajani Qo\'shish'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

// React 19 root mounting with HMR guard
const container = document.getElementById('admin-root');
if (container) {
  if (!window.__adminReactRoot) {
    window.__adminReactRoot = createRoot(container);
  }
  window.__adminReactRoot.render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}
