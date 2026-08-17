import { getCarById } from '@/app/actions';
import { notFound } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ params }: { params: Promise<{ carId: string }> }) {
  const { carId } = await params;
  const car = await getCarById(Number(carId));

  if (!car) return notFound();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-neutral-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-neutral-400 hover:text-[#E6D5B8] transition-colors flex items-center gap-2 text-sm">
          <span>&larr;</span> Kembali ke Garasi
        </Link>
        <span className="text-[#E6D5B8] text-sm font-bold tracking-widest uppercase">Checkout</span>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* LEFT — Car Summary */}
          <div className="lg:col-span-2 animate-fadeIn">
            <div className="sticky top-24">
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${car.image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/30 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] text-[#E6D5B8] uppercase tracking-widest border border-[#E6D5B8]/30 rounded">
                  {car.brand}
                </div>
              </div>

              <h2 className="text-3xl font-serif text-white mb-1">{car.name}</h2>
              <p className="text-neutral-400 mb-6">{car.color}</p>

              <div className="bg-[#121212] border border-neutral-800 rounded-lg p-5 space-y-3 mb-6">
                <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Spesifikasi Utama</h4>
                {car.engine && <SpecRow label="Mesin" value={car.engine} />}
                {car.horsepower && <SpecRow label="Tenaga" value={car.horsepower} />}
                {car.topSpeed && <SpecRow label="Top Speed" value={car.topSpeed} />}
                {car.transmission && <SpecRow label="Transmisi" value={car.transmission} />}
                <SpecRow label="Kapasitas" value={`${car.seats} Penumpang`} />
              </div>

              <div className="bg-[#121212] border border-[#E6D5B8]/20 rounded-lg p-5">
                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Harga Sewa</p>
                <p className="text-2xl text-gold-gradient font-serif">{car.price} <span className="text-sm text-neutral-500 font-sans">/ hari</span></p>
              </div>
            </div>
          </div>

          {/* RIGHT — Checkout Form */}
          <div className="lg:col-span-3 animate-slideUp">
            <CheckoutForm car={JSON.parse(JSON.stringify(car))} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-200 font-medium">{value}</span>
    </div>
  );
}
