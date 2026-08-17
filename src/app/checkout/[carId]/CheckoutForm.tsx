'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBooking, updateBookingStatus } from '@/app/actions'

type Car = {
  id: number
  brand: string
  name: string
  color: string | null
  price: string
  image: string | null
  engine: string | null
  horsepower: string | null
  topSpeed: string | null
  seats: number
}

type Step = 1 | 2 | 3 | 4

const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS',
    icon: '📱',
    desc: 'Scan QR untuk bayar',
  },
  {
    id: 'bca',
    name: 'VA BCA',
    icon: '🏦',
    desc: 'Transfer ke Virtual Account',
  },
  {
    id: 'mandiri',
    name: 'VA Mandiri',
    icon: '🏛️',
    desc: 'Transfer ke Virtual Account',
  },
  {
    id: 'card',
    name: 'Kartu Kredit',
    icon: '💳',
    desc: 'Visa / Mastercard',
  },
]

function parsePrice(priceStr: string): number {
  const num = priceStr.replace(/[^0-9]/g, '')
  return parseInt(num, 10) || 0
}

function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID')
}

function generateVirtualAccount(carId: number, amount: number): string {
  const amountPart = String(amount).replace(/\D/g, '').slice(-8).padStart(8, '0')
  const carPart = String(carId).padStart(4, '0')

  return `8800${carPart}${amountPart}`
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {[
        { num: 1, label: 'Data Diri' },
        { num: 2, label: 'Jadwal' },
        { num: 3, label: 'Pembayaran' },
      ].map((item, index) => (
        <div key={item.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step >= item.num
                  ? 'bg-[#E6D5B8] border-[#E6D5B8] text-black'
                  : 'border-neutral-700 text-neutral-500'
              }`}
            >
              {step > item.num ? '✓' : item.num}
            </div>

            <span
              className={`text-[10px] mt-2 uppercase tracking-wider ${
                step >= item.num
                  ? 'text-[#E6D5B8]'
                  : 'text-neutral-600'
              }`}
            >
              {item.label}
            </span>
          </div>

          {index < 2 && (
            <div
              className={`w-16 sm:w-24 h-[2px] mx-2 mb-5 transition-colors duration-300 ${
                step > item.num
                  ? 'bg-[#E6D5B8]'
                  : 'bg-neutral-800'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CheckoutForm({ car }: { car: Car }) {
  const [step, setStep] = useState<Step>(1)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<number | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() -
              new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const pricePerDay = parsePrice(car.price)
  const totalPrice = pricePerDay * days

  const virtualAccount = generateVirtualAccount(
    car.id,
    totalPrice
  )

  const canProceedStep1 = name.trim().length > 0
  const canProceedStep2 =
    Boolean(startDate) &&
    Boolean(endDate) &&
    days > 0
  const canPay = paymentMethod !== ''

  async function handlePayment() {
    if (!canPay) return

    setLoading(true)

    try {
      const booking = await createBooking({
        carId: car.id,
        customerName: name,
        customerPhone: phone || undefined,
        startDate,
        endDate,
        notes: notes || undefined,
        totalPrice: formatRupiah(totalPrice),
      })

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      )

      await updateBookingStatus(
        booking.id,
        'PAID'
      )

      setBookingId(booking.id)
      setStep(4)
    } catch {
      alert(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (step === 4) {
    return (
      <div className="text-center py-12 animate-scaleIn">

        <div className="relative inline-block mb-8">
          <div
            className="absolute -top-4 -left-6 text-2xl animate-float"
            style={{ animationDelay: '0s' }}
          >
            ✨
          </div>

          <div
            className="absolute -top-2 -right-8 text-xl animate-float"
            style={{ animationDelay: '0.5s' }}
          >
            🎉
          </div>

          <div
            className="absolute -bottom-2 -left-4 text-lg animate-float"
            style={{ animationDelay: '1s' }}
          >
            ⭐
          </div>

          <div
            className="absolute -bottom-4 -right-6 text-2xl animate-float"
            style={{ animationDelay: '1.5s' }}
          >
            🏎️
          </div>

          <div className="w-24 h-24 rounded-full bg-green-950 border-2 border-green-500 flex items-center justify-center mx-auto">
            <span className="text-green-400 text-5xl">
              ✓
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-serif text-white mb-3">
          Pembayaran Berhasil!
        </h2>

        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Terima kasih,{' '}
          <span className="text-[#E6D5B8]">
            {name}
          </span>
          . Reservasi Anda untuk
          <span className="text-white font-medium">
            {' '}
            {car.name}
          </span>{' '}
          telah dikonfirmasi.
        </p>

        <div className="bg-[#121212] border border-neutral-800 rounded-lg p-6 max-w-sm mx-auto text-left mb-8">

          <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-800">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">
              Booking ID
            </span>

            <span className="text-[#E6D5B8] font-mono font-bold">
              HG-
              {String(bookingId).padStart(5, '0')}
            </span>
          </div>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-neutral-500">
                Kendaraan
              </span>
              <span className="text-white">
                {car.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">
                Tanggal
              </span>
              <span className="text-white">
                {new Date(startDate).toLocaleDateString(
                  'id-ID'
                )}{' '}
                —{' '}
                {new Date(endDate).toLocaleDateString(
                  'id-ID'
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">
                Durasi
              </span>
              <span className="text-white">
                {days} hari
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
              <span className="text-neutral-400 font-medium">
                Total
              </span>

              <span className="text-[#E6D5B8] font-serif text-lg">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
              LUNAS
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#E6D5B8] text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors rounded"
        >
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return (
    <div>

      <h1 className="text-2xl sm:text-3xl font-serif text-white mb-2">
        Reservasi Kendaraan
      </h1>

      <p className="text-neutral-500 text-sm mb-8">
        Lengkapi data berikut untuk memesan{' '}
        <span className="text-[#E6D5B8]">
          {car.name}
        </span>
      </p>

      <StepIndicator step={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-[#121212] border border-neutral-800 rounded-lg p-6 space-y-5">

            <h3 className="text-lg font-serif text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#E6D5B8]/10 text-[#E6D5B8] flex items-center justify-center text-sm">
                1
              </span>
              Informasi Penyewa
            </h3>

            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Nama Lengkap *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Masukkan nama lengkap Anda"
                className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Nomor Telepon
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="08xxxxxxxxxx"
                className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Catatan (Opsional)
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={3}
                placeholder="Permintaan khusus, lokasi antar-jemput, dll."
                className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] transition-colors resize-none"
              />
            </div>
          </div>

          <button
            onClick={() =>
              canProceedStep1 && setStep(2)
            }
            disabled={!canProceedStep1}
            className={`w-full py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
              canProceedStep1
                ? 'bg-[#E6D5B8] text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
          >
            Lanjutkan &rarr;
          </button>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">

          <div className="bg-[#121212] border border-neutral-800 rounded-lg p-6 space-y-5">

            <h3 className="text-lg font-serif text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#E6D5B8]/10 text-[#E6D5B8] flex items-center justify-center text-sm">
                2
              </span>
              Jadwal Sewa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                  Tanggal Mulai *
                </label>

                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => {
                    setStartDate(e.target.value)

                    if (
                      endDate &&
                      e.target.value > endDate
                    ) {
                      setEndDate('')
                    }
                  }}
                  className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                  Tanggal Selesai *
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E6D5B8] transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {days > 0 && (
              <div className="bg-[#0A0A0A] border border-[#E6D5B8]/20 rounded-lg p-5 animate-scaleIn">

                <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-4">
                  Rincian Biaya
                </h4>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-neutral-400">
                      {car.price} × {days} hari
                    </span>

                    <span className="text-white">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-neutral-800">

                    <span className="text-white font-semibold">
                      Total
                    </span>

                    <span className="text-[#E6D5B8] font-serif text-xl">
                      {formatRupiah(totalPrice)}
                    </span>

                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => setStep(1)}
              className="px-6 py-4 rounded-lg text-sm font-bold uppercase tracking-widest bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              &larr;
            </button>

            <button
              onClick={() =>
                canProceedStep2 && setStep(3)
              }
              disabled={!canProceedStep2}
              className={`flex-1 py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                canProceedStep2
                  ? 'bg-[#E6D5B8] text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              }`}
            >
              Lanjutkan ke Pembayaran &rarr;
            </button>

          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">

          {/* ORDER SUMMARY */}
          <div className="bg-[#121212] border border-[#E6D5B8]/20 rounded-lg p-5">

            <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-4">
              Ringkasan Pesanan
            </h4>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-neutral-500">
                  Penyewa
                </span>

                <span className="text-white">
                  {name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">
                  Kendaraan
                </span>

                <span className="text-white">
                  {car.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">
                  Periode
                </span>

                <span className="text-white">
                  {new Date(startDate).toLocaleDateString(
                    'id-ID'
                  )}{' '}
                  —{' '}
                  {new Date(endDate).toLocaleDateString(
                    'id-ID'
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">
                  Durasi
                </span>

                <span className="text-white">
                  {days} hari
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-neutral-800">

                <span className="text-white font-semibold">
                  Total Pembayaran
                </span>

                <span className="text-[#E6D5B8] font-serif text-xl">
                  {formatRupiah(totalPrice)}
                </span>

              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="bg-[#121212] border border-neutral-800 rounded-lg p-6 space-y-5">

            <h3 className="text-lg font-serif text-white flex items-center gap-3">

              <span className="w-8 h-8 rounded-full bg-[#E6D5B8]/10 text-[#E6D5B8] flex items-center justify-center text-sm">
                3
              </span>

              Metode Pembayaran
            </h3>

            <div className="grid grid-cols-2 gap-3">

              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() =>
                    setPaymentMethod(pm.id)
                  }
                  className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                    paymentMethod === pm.id
                      ? 'border-[#E6D5B8] bg-[#E6D5B8]/5 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                      : 'border-neutral-800 bg-[#0A0A0A] hover:border-neutral-600'
                  }`}
                >
                  <span className="text-2xl mb-2 block">
                    {pm.icon}
                  </span>

                  <span
                    className={`text-sm font-medium block ${
                      paymentMethod === pm.id
                        ? 'text-[#E6D5B8]'
                        : 'text-white'
                    }`}
                  >
                    {pm.name}
                  </span>

                  <span className="text-[10px] text-neutral-500 block mt-0.5">
                    {pm.desc}
                  </span>
                </button>
              ))}

            </div>

            {/* QRIS */}
            {paymentMethod === 'qris' && (
              <div className="flex flex-col items-center py-6 animate-scaleIn">

                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">
                  Scan QR Code untuk Membayar
                </p>

                <div className="w-48 h-48 bg-white rounded-lg p-3 mb-4 relative">

                  <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">

                    {Array.from({ length: 64 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className={`rounded-[1px] ${
                            index % 3 === 0 ||
                            index % 5 === 0
                              ? 'bg-black'
                              : 'bg-white'
                          }`}
                        />
                      )
                    )}

                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded">
                      <span className="text-[10px] font-bold text-black">
                        HG
                      </span>
                    </div>
                  </div>

                </div>

                <p className="text-sm text-neutral-400">
                  Hidayat Garage Payment
                </p>

                <p className="text-lg text-[#E6D5B8] font-serif mt-1">
                  {formatRupiah(totalPrice)}
                </p>

              </div>
            )}

            {/* VIRTUAL ACCOUNT */}
            {(paymentMethod === 'bca' ||
              paymentMethod === 'mandiri') && (
              <div className="py-6 animate-scaleIn">

                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">
                  Nomor Virtual Account
                </p>

                <div className="bg-[#0A0A0A] border border-neutral-700 rounded-lg px-5 py-4 flex items-center justify-between">

                  <span className="font-mono text-xl text-white tracking-wider">
                    {virtualAccount}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        virtualAccount
                      )
                    }
                    className="text-[#E6D5B8] text-xs font-bold uppercase hover:text-yellow-400 transition-colors"
                  >
                    Salin
                  </button>

                </div>

                <p className="text-xs text-neutral-600 mt-3">
                  Transfer ke nomor VA di atas sebelum{' '}
                  <span className="text-neutral-400">
                    24 jam
                  </span>{' '}
                  dari sekarang.
                </p>

                <div className="mt-4 flex justify-between text-sm">

                  <span className="text-neutral-500">
                    Jumlah Transfer
                  </span>

                  <span className="text-[#E6D5B8] font-serif text-lg">
                    {formatRupiah(totalPrice)}
                  </span>

                </div>
              </div>
            )}

            {/* CARD */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 py-4 animate-scaleIn">

                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                    Nomor Kartu
                  </label>

                  <input
                    type="text"
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                    className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                      Kadaluarsa
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                      CVV
                    </label>

                    <input
                      type="text"
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-[#0A0A0A] border border-neutral-700 rounded-lg px-4 py-3 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] transition-colors"
                    />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-4 rounded-lg text-sm font-bold uppercase tracking-widest bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              &larr;
            </button>

            <button
              type="button"
              onClick={handlePayment}
              disabled={!canPay || loading}
              className={`flex-1 py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                canPay && !loading
                  ? 'bg-[#E6D5B8] text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Bayar Sekarang — {formatRupiah(totalPrice)}
                </>
              )}
            </button>

          </div>
        </div>
      )}
    </div>
  )
}