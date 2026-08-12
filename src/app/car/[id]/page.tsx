import Link from 'next/link';
import { getCarById, getCars } from '@/app/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const car = await getCarById(Number(id));
  
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-[#E5E5E5]">
        <h1 className="text-4xl font-serif mb-4">Unit Tidak Ditemukan</h1>
        <p className="text-neutral-400 mb-8">Kendaraan yang Anda cari mungkin telah dihapus atau ID tidak valid.</p>
        <Link href="/" className="px-6 py-3 bg-[#E6D5B8] text-black font-semibold uppercase tracking-widest hover:bg-yellow-500 transition-colors">
          Kembali ke Koleksi
        </Link>
      </div>
    );
  }

  const allCars = await getCars();
  const relatedCars = allCars.filter(c => c.id !== car.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5]">
      {/* 1. BREADCRUMB NAV */}
      <nav className="sticky top-0 z-50 glass border-b border-neutral-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-sm">
        <Link href="/" className="text-neutral-400 hover:text-[#E6D5B8] transition-colors flex items-center gap-2">
          <span>&larr;</span> Kembali ke Koleksi
        </Link>
        <div className="text-neutral-500 hidden sm:block">
          <Link href="/" className="hover:text-[#E5E5E5] transition-colors">Hidayat Garage</Link> / <span className="text-neutral-300">{car.brand}</span> / <span className="text-[#E6D5B8]">{car.name}</span>
        </div>
      </nav>

      {/* 2. HERO IMAGE */}
      <section className="relative w-full h-[50vh] min-h-[400px] animate-fadeIn">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${car.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-black/10"></div>
        <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex flex-col items-start gap-4">
          <span className="px-3 py-1 bg-black/60 border border-[#E6D5B8]/30 text-[#E6D5B8] text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
            {car.brand}
          </span>
          <div className={`px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${car.status === 'Tersedia' ? 'bg-green-950/80 text-green-400 border border-green-900/50' : 'bg-red-950/80 text-red-400 border border-red-900/50'} backdrop-blur-sm`}>
            <span className={`w-2 h-2 rounded-full ${car.status === 'Tersedia' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            {car.status}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slideUp">
        {/* 3. CAR TITLE SECTION */}
        <div className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-neutral-800 pb-8">
          <div>
            <h2 className="text-[#E6D5B8] tracking-[0.2em] text-sm uppercase mb-2">{car.brand}</h2>
            <h1 className="text-4xl md:text-5xl font-serif mb-2 text-white">{car.name}</h1>
            <p className="text-neutral-400 text-lg">{car.color}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-1">Mulai Dari</p>
            <p className="text-3xl md:text-4xl text-gold-gradient font-serif">{car.price} <span className="text-lg text-neutral-500 font-sans">/ hari</span></p>
          </div>
        </div>

        {/* 4. SPECS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          <SpecCard icon="🏎️" label="Top Speed" value={car.topSpeed} />
          <SpecCard icon="⚡" label="Tenaga" value={car.horsepower || '-'} />
          <SpecCard icon="🚀" label="0-100 km/h" value={car.acceleration || '-'} />
          <SpecCard icon="⚙️" label="Mesin" value={car.engine || '-'} />
          <SpecCard icon="🔧" label="Transmisi" value={car.transmission || '-'} />
          <SpecCard icon="👥" label="Kapasitas" value={`${car.seats} Penumpang`} />
        </div>

        {/* 5. DESCRIPTION */}
        <section className="mb-20 border-t border-b border-neutral-800 py-12">
          <h3 className="text-2xl font-serif text-[#E5E5E5] mb-6 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#E6D5B8]"></span>
            Tentang Unit Ini
          </h3>
          <p className="text-neutral-300 leading-relaxed text-lg max-w-4xl">
            {car.description || 'Tidak ada deskripsi.'}
          </p>
        </section>

        {/* 6. RESERVATION CTA */}
        <section className="bg-[#121212] border border-neutral-800 p-8 md:p-12 text-center relative overflow-hidden mb-24">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6D5B8]/5 via-transparent to-transparent"></div>
          <h3 className="text-3xl font-serif mb-4 relative z-10 text-white">Mulai Perjalanan Anda</h3>
          <p className="text-neutral-400 mb-8 relative z-10 max-w-2xl mx-auto text-lg">
            Nikmati pengalaman berkendara tak terlupakan dengan {car.name}. 
            Harga sewa mulai dari <span className="text-[#E6D5B8]">{car.price} / hari</span>.
          </p>
          
          <div className="relative z-10">
            <Link href={`/checkout/${car.id}`} className="inline-block px-10 py-4 bg-[#E6D5B8] text-black font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              Reservasi Sekarang
            </Link>
          </div>
        </section>

        {/* 7. RELATED CARS */}
        {relatedCars.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-serif text-[#E5E5E5] mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#E6D5B8]"></span>
              Koleksi Lainnya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar) => (
                <Link key={relatedCar.id} href={`/car/${relatedCar.id}`} className="block group hover-lift">
                  <div className="bg-[#121212] border border-neutral-800 h-full flex flex-col overflow-hidden transition-colors duration-300 group-hover:border-neutral-600">
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${relatedCar.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-80"></div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] text-[#E6D5B8] uppercase tracking-wider border border-[#E6D5B8]/30">
                        {relatedCar.brand}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h5 className="text-xl font-serif mb-2 text-white group-hover:text-[#E6D5B8] transition-colors">{relatedCar.name}</h5>
                      <div className="mt-auto pt-4 border-t border-neutral-800 flex justify-between items-center">
                        <span className="text-sm text-neutral-300 font-medium">{relatedCar.price} <span className="text-[10px] text-neutral-500 font-normal">/ hari</span></span>
                        <span className="text-[#E6D5B8] text-xl leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: string; label: string; value: string | null }) {
  return (
    <div className="bg-[#121212] border border-neutral-800 p-5 flex flex-col sm:flex-row sm:items-center items-start gap-4 hover:border-[#E6D5B8]/50 transition-colors">
      <div className="text-2xl md:text-3xl opacity-80">{icon}</div>
      <div>
        <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white font-medium text-sm md:text-base">{value}</p>
      </div>
    </div>
  );
}
