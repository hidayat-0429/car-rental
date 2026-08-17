'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

type Car = {
  id: number;
  name: string;
  brand: string;
  color: string | null;
  transmission: string | null;
  horsepower: string | number | null;
  topSpeed: string | number | null;
  price: string | number;
  image: string | null;
  status: string;
};

export default function ClientPage({ initialCars }: { initialCars: Car[] }) {
  const [cars] = useState<Car[]>(initialCars);
  const isLoaded = true;
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState<string>('Semua');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derived data
  const uniqueBrands = useMemo(() => {
    const brands = cars.map(c => c.brand);
    return ['Semua', ...Array.from(new Set(brands))];
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchBrand = activeBrand === 'Semua' || car.brand === activeBrand;
      const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [cars, activeBrand, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: cars.length,
      available: cars.filter(c => c.status === 'Tersedia').length,
      brands: (uniqueBrands.length > 1 ? uniqueBrands.length - 1 : 0),
      satisfaction: '99%'
    };
  }, [cars, uniqueBrands]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingSuccess(true);
    setTimeout(() => {
      setBookingCar(null);
      setIsBookingSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans selection:bg-[#E6D5B8] selection:text-[#0A0A0A]">
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-neutral-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="font-serif text-2xl font-bold tracking-wider hover-lift inline-block">
                <span className="text-white">Hidayat</span>{' '}
                <span className="text-[#E6D5B8]">Garage</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="#collection" className="text-neutral-300 hover:text-[#E6D5B8] px-3 py-2 text-sm font-medium transition-colors">Koleksi</Link>
                <Link href="#features" className="text-neutral-300 hover:text-[#E6D5B8] px-3 py-2 text-sm font-medium transition-colors">Layanan</Link>
                <Link href="#testimonials" className="text-neutral-300 hover:text-[#E6D5B8] px-3 py-2 text-sm font-medium transition-colors">Testimoni</Link>
                <Link href="/admin" className="bg-[#E6D5B8]/10 text-[#E6D5B8] border border-[#E6D5B8]/50 hover:bg-[#E6D5B8] hover:text-[#0A0A0A] px-5 py-2 rounded-full text-sm font-medium transition-all hover-lift">
                  Admin Panel
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-neutral-800`}>
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col gap-2">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="#collection" className="text-neutral-300 hover:text-[#E6D5B8] block px-3 py-3 rounded-md text-base font-medium">Koleksi</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="#features" className="text-neutral-300 hover:text-[#E6D5B8] block px-3 py-3 rounded-md text-base font-medium">Layanan</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="#testimonials" className="text-neutral-300 hover:text-[#E6D5B8] block px-3 py-3 rounded-md text-base font-medium">Testimoni</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className="text-[#E6D5B8] block px-3 py-3 rounded-md text-base font-medium border border-[#E6D5B8]/30 bg-[#E6D5B8]/5 mt-2">Admin Panel</Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/80 to-[#0A0A0A] z-10" />
          {/* Placeholder for Hero Image - In a real app this would be an actual image */}
          <div className="absolute inset-0 bg-neutral-900 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-40 animate-scaleIn" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center animate-slideUp">
          <span className="inline-block py-1 px-3 rounded-full bg-[#121212] border border-[#E6D5B8]/30 text-[#E6D5B8] text-sm font-semibold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            Premium Supercar Rental
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
            Drive Your <span className="text-gold-gradient inline-block animate-gradientShift">Dream</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Rasakan performa puncak dan kemewahan tanpa kompromi. Koleksi eksklusif supercar dunia, kini dalam genggaman Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-neutral-300">
            <span className="flex items-center gap-2"><span className="text-[#E6D5B8]">✦</span> 50+ Supercar</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="flex items-center gap-2"><span className="text-[#E6D5B8]">✦</span> 24/7 Concierge</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="flex items-center gap-2"><span className="text-[#E6D5B8]">✦</span> Doorstep Delivery</span>
          </div>
          
          <div className="mt-12">
            <a href="#collection" className="inline-block bg-[#E6D5B8] text-[#0A0A0A] px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300 hover-lift hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              Eksplorasi Koleksi
            </a>
          </div>
        </div>
      </section>

      {/* 3. STATS BAR */}
      <section className="border-y border-neutral-800 bg-[#121212]/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 divide-x divide-neutral-800/0 md:divide-neutral-800">
            <div className="text-center">
              <div className="text-3xl mb-2">🏎️</div>
              <div className="text-4xl font-serif font-bold text-white mb-1">{stats.total}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Total Armada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✨</div>
              <div className="text-4xl font-serif font-bold text-white mb-1">{stats.available}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👑</div>
              <div className="text-4xl font-serif font-bold text-white mb-1">{stats.brands}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Merek Eksklusif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-4xl font-serif font-bold text-[#E6D5B8] mb-1">{stats.satisfaction}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEARCH + BRAND FILTER */}
      <section id="collection" className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-4 flex items-center gap-4">
              Koleksi Utama
              <span className="text-lg px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 font-sans">
                {filteredCars.length} Unit
              </span>
            </h2>
            <div className="h-1 w-24 bg-[#E6D5B8] rounded-full line-gold"></div>
          </div>
          
          <div className="w-full md:w-auto relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari supercar atau merek..."
              className="w-full bg-[#121212] border border-neutral-800 text-white rounded-full pl-10 pr-4 py-3 focus:outline-none focus:border-[#E6D5B8] focus:ring-1 focus:ring-[#E6D5B8] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Brand Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-4 mb-8">
          {uniqueBrands.map(brand => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeBrand === brand 
                  ? 'bg-[#E6D5B8] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-[#121212] text-neutral-400 border border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* 5. CAR CATALOG GRID & 11. LOADING SKELETON & 12. EMPTY STATE */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
        {!isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden h-[460px]">
                <div className="h-56 bg-neutral-900 animate-shimmer w-full"></div>
                <div className="p-6">
                  <div className="h-6 bg-neutral-900 animate-shimmer w-1/3 mb-4 rounded"></div>
                  <div className="h-8 bg-neutral-900 animate-shimmer w-2/3 mb-6 rounded"></div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-10 bg-neutral-900 animate-shimmer rounded"></div>
                    <div className="h-10 bg-neutral-900 animate-shimmer rounded"></div>
                  </div>
                  <div className="h-12 bg-neutral-900 animate-shimmer rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] border border-neutral-800 rounded-2xl">
            <div className="text-6xl mb-6 opacity-50">🔍</div>
            <h3 className="text-2xl font-serif text-white mb-2">Tidak ada hasil ditemukan</h3>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Maaf, supercar dengan pencarian &quot;{searchQuery}&quot; pada merek &quot;{activeBrand}&quot; tidak tersedia saat ini.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveBrand('Semua'); }}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-full transition-colors font-medium"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {filteredCars.map(car => (
              <div key={car.id} className="group bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#E6D5B8]/50 hover-lift flex flex-col h-full shadow-lg shadow-black/50">
                <div className="relative h-56 overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={car.image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1000'} 
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#0A0A0A]/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-700 uppercase tracking-wider shadow-xl">
                      {car.brand}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-md shadow-xl ${
                      car.status === 'Tersedia' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      <span className={`w-2 h-2 rounded-full status-dot ${car.status === 'Tersedia' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                      {car.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-neutral-500 text-sm font-medium mb-1">{car.color} • {car.transmission}</p>
                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-[#E6D5B8] transition-colors">{car.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0A0A0A] p-3 rounded-xl border border-neutral-800/50">
                      <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Power</div>
                      <div className="text-white font-medium">{car.horsepower} <span className="text-[#E6D5B8] text-xs">HP</span></div>
                    </div>
                    <div className="bg-[#0A0A0A] p-3 rounded-xl border border-neutral-800/50">
                      <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Top Speed</div>
                      <div className="text-white font-medium">{car.topSpeed} <span className="text-[#E6D5B8] text-xs">km/h</span></div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-neutral-500 text-xs uppercase tracking-wider">Sewa per hari</div>
                      <div className="text-xl font-bold text-[#E6D5B8]">
                        {car.price}
                      </div>
                    </div>
                    
                    {car.status === 'Tersedia' ? (
                      <button 
                        onClick={() => setBookingCar(car)}
                        className="bg-white text-[#0A0A0A] hover:bg-[#E6D5B8] px-6 py-3 rounded-full font-bold text-sm transition-colors hover-lift"
                      >
                        Reservasi
                      </button>
                    ) : (
                      <button disabled className="bg-neutral-800 text-neutral-500 px-6 py-3 rounded-full font-bold text-sm cursor-not-allowed">
                        Disewa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. WHY CHOOSE US SECTION */}
      <section id="features" className="py-24 bg-[#0A0A0A] border-t border-neutral-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Mengapa Hidayat Garage?</h2>
            <div className="h-1 w-24 bg-[#E6D5B8] rounded-full mx-auto line-gold"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: 'Certified Supercars', desc: 'Setiap unit melewati inspeksi 150 titik secara ketat sebelum dikirim.' },
              { icon: '🚗', title: 'Doorstep Delivery', desc: 'Diantar langsung ke lokasi Anda di seluruh penjuru kota dengan aman.' },
              { icon: '🛡️', title: 'VIP Insurance', desc: 'Asuransi komprehensif premium untuk ketenangan pikiran Anda.' },
              { icon: '📞', title: '24/7 Concierge', desc: 'Tim eksklusif siap melayani kebutuhan Anda kapanpun, dimanapun.' },
            ].map((feature, i) => (
              <div key={i} className="bg-[#121212] p-8 rounded-2xl border border-neutral-800 hover:border-[#E6D5B8] transition-all duration-300 hover-lift group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 transform-origin-left">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E6D5B8] transition-colors">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Apa Kata Mereka</h2>
            <div className="h-1 w-24 bg-[#E6D5B8] rounded-full line-gold"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: 'Pengalaman luar biasa! McLaren 720S diantar tepat waktu. Kondisi sempurna.', name: 'Adrian W.', city: 'Jakarta' },
              { quote: 'Layanan concierge terbaik yang pernah saya gunakan. The Chiron was a dream.', name: 'Michelle T.', city: 'Surabaya' },
              { quote: 'Proses reservasi mudah, mobil selalu dalam kondisi showroom. Highly recommended!', name: 'Reza K.', city: 'Bali' },
            ].map((testi, i) => (
              <div key={i} className="bg-[#0A0A0A] p-8 rounded-2xl border border-neutral-800 relative">
                <div className="text-[#E6D5B8] flex gap-1 mb-6 text-xl">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-neutral-300 italic mb-8 leading-relaxed text-lg">&quot;{testi.quote}&quot;</p>
                <div className="mt-auto border-t border-neutral-800 pt-6">
                  <div className="font-bold text-white text-lg">{testi.name}</div>
                  <div className="text-neutral-500 text-sm">{testi.city}</div>
                </div>
                {/* Decorative quote mark */}
                <div className="absolute top-6 right-8 text-6xl text-neutral-800/30 font-serif leading-none select-none">&quot;</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ENHANCED FOOTER */}
      <footer className="bg-[#0A0A0A] pt-20 pb-10 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="font-serif text-3xl font-bold tracking-wider inline-block mb-6">
                <span className="text-white">Hidayat</span> <span className="text-[#E6D5B8]">Garage</span>
              </Link>
              <p className="text-neutral-400 max-w-sm text-sm leading-relaxed mb-8">
                Penyedia layanan rental supercar premium terbaik di Indonesia. Menghadirkan pengalaman berkendara mewah tanpa kompromi.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#121212] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-[#E6D5B8] hover:text-[#E6D5B8] transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#121212] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-[#E6D5B8] hover:text-[#E6D5B8] transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#121212] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-[#E6D5B8] hover:text-[#E6D5B8] transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#121212] border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-[#E6D5B8] hover:text-[#E6D5B8] transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#collection" className="text-neutral-400 hover:text-[#E6D5B8] transition-colors">Koleksi Supercar</a></li>
                <li><a href="#features" className="text-neutral-400 hover:text-[#E6D5B8] transition-colors">Layanan Premium</a></li>
                <li><a href="#testimonials" className="text-neutral-400 hover:text-[#E6D5B8] transition-colors">Testimoni Klien</a></li>
                <li><Link href="/admin" className="text-neutral-400 hover:text-[#E6D5B8] transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-neutral-400">
                  <span className="text-[#E6D5B8] mt-1">📍</span>
                  <span>Jl. Sudirman No. 1<br/>Jakarta Selatan 12190</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-400">
                  <span className="text-[#E6D5B8]">📞</span>
                  <span>+62 811 2345 6789</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-400">
                  <span className="text-[#E6D5B8]">✉️</span>
                  <span>vip@Hidayatgarage.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-neutral-900 text-center text-neutral-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Hidayat Garage. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. BOOKING MODAL */}
      {bookingCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm" onClick={() => !isBookingSuccess && setBookingCar(null)}></div>
          
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl w-full max-w-lg relative z-10 overflow-hidden animate-scaleIn shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
            {isBookingSuccess ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-white mb-4">Reservasi Berhasil!</h3>
                <p className="text-neutral-400">Concierge kami akan segera menghubungi Anda via WhatsApp untuk konfirmasi pengiriman {bookingCar.name}.</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b border-neutral-800 flex justify-between items-start bg-neutral-900/50">
                  <div>
                    <span className="text-[#E6D5B8] text-xs font-bold uppercase tracking-wider mb-1 block">{bookingCar.brand}</span>
                    <h3 className="text-2xl font-serif text-white">{bookingCar.name}</h3>
                    <div className="mt-2 text-xl font-bold text-white">
                      {bookingCar.price} <span className="text-sm font-normal text-neutral-500">/ hari</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setBookingCar(null)}
                    className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Modal Form */}
                <div className="p-6 overflow-y-auto no-scrollbar">
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Nama Lengkap</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Nomor WhatsApp</label>
                      <input 
                        required 
                        type="tel" 
                        className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors" 
                        placeholder="+62 812..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Mulai Sewa</label>
                        <input 
                          required 
                          type="date" 
                          className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors [color-scheme:dark]" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Durasi</label>
                        <select className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors appearance-none">
                          <option value="1">1 Hari</option>
                          <option value="3">3 Hari</option>
                          <option value="7">7 Hari</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-2">Catatan Khusus (Opsional)</label>
                      <textarea 
                        rows={3} 
                        className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors resize-none" 
                        placeholder="Lokasi pengiriman spesifik..."
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-800">
                      <button 
                        type="submit" 
                        className="w-full bg-[#E6D5B8] text-[#0A0A0A] py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors"
                      >
                        Konfirmasi Reservasi
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 10. FLOATING BUTTONS */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          className={`w-14 h-14 bg-[#121212] border border-[#E6D5B8]/50 text-[#E6D5B8] rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:bg-[#E6D5B8] hover:text-[#0A0A0A] ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/6281123456789" 
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-110"
          aria-label="Chat WhatsApp"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}