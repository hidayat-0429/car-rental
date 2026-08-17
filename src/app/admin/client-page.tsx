'use client'

import {
  useState,
  useRef,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { getCars, getBookings } from '../actions'
import {
  addCar,
  updateCar,
  deleteCar,
  toggleCarStatus,
  updateBookingStatus,
} from '../actions'

type Car = Awaited<ReturnType<typeof getCars>>[number]
type Booking = Awaited<ReturnType<typeof getBookings>>[number]

type CarFormData = {
  brand: string
  name: string
  color: string
  price: string
  horsepower: string
  acceleration: string
  engine: string
  description: string
  image: string
  status: 'Tersedia' | 'Disewa'
  topSpeed: string
  transmission: string
  seats: number
}

type CarFormProps = {
  formData: CarFormData
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  setFormData: Dispatch<SetStateAction<CarFormData>>
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>
  submitText: string
  onClose: () => void
  isSubmitting: boolean
}

const initialFormData: CarFormData = {
  brand: '',
  name: '',
  color: '',
  price: '',
  horsepower: '',
  acceleration: '',
  engine: '',
  description: '',
  image: '',
  status: 'Tersedia',
  topSpeed: '',
  transmission: '',
  seats: 2,
}

export default function AdminDashboard({
  initialCars,
  initialBookings = [],
}: {
  initialCars: Car[]
  initialBookings?: Booking[]
}) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState({
    message: '',
    visible: false,
  })
  const [activeTab, setActiveTab] = useState<'armada' | 'transaksi'>(
    'armada'
  )

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] =
    useState<CarFormData>(initialFormData)

  const showToast = (message: string) => {
    setToast({
      message,
      visible: true,
    })

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        visible: false,
      }))
    }, 2500)
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (
      !formData.brand ||
      !formData.name ||
      !formData.price
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const dataToSave = {
        ...formData,
        seats: Number(formData.seats) || 2,
      } as Parameters<typeof addCar>[0]

      await addCar(dataToSave)

      setIsAddModalOpen(false)
      setFormData(initialFormData)

      showToast('Unit berhasil ditambahkan')
      router.refresh()
    } catch (error) {
      console.error(error)
      showToast('Gagal menambahkan unit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (
      !selectedCar ||
      !formData.brand ||
      !formData.name ||
      !formData.price
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const dataToSave = {
        ...formData,
        seats: Number(formData.seats) || 2,
      } as Parameters<typeof updateCar>[1]

      await updateCar(selectedCar.id, dataToSave)

      setIsEditModalOpen(false)
      setSelectedCar(null)

      showToast('Data berhasil diperbarui')
      router.refresh()
    } catch (error) {
      console.error(error)
      showToast('Gagal memperbarui data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (car: Car) => {
    setSelectedCar(car)

    setFormData({
      brand: car.brand ?? '',
      name: car.name ?? '',
      color: car.color ?? '',
      price: String(car.price ?? ''),
      horsepower: String(car.horsepower ?? ''),
      acceleration: String(car.acceleration ?? ''),
      engine: String(car.engine ?? ''),
      description: String(car.description ?? ''),
      image: car.image ?? '',
      status:
        car.status === 'Disewa'
          ? 'Disewa'
          : 'Tersedia',
      topSpeed: String(car.topSpeed ?? ''),
      transmission: String(car.transmission ?? ''),
      seats: Number(car.seats ?? 2),
    })

    setIsEditModalOpen(true)
  }

  const openDeleteModal = (car: Car) => {
    setSelectedCar(car)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCar) {
      return
    }

    try {
      await deleteCar(selectedCar.id)

      setIsDeleteModalOpen(false)
      setSelectedCar(null)

      showToast('Unit berhasil dihapus')
      router.refresh()
    } catch (error) {
      console.error(error)
      showToast('Gagal menghapus unit')
    }
  }

  const handleToggleStatus = async (
    id: number,
    currentStatus: string
  ) => {
    try {
      await toggleCarStatus(id, currentStatus)

      showToast('Status berhasil diubah')
      router.refresh()
    } catch (error) {
      console.error(error)
      showToast('Gagal mengubah status')
    }
  }

  const filteredCars = initialCars.filter((car) => {
    const query = searchQuery.toLowerCase()

    return (
      car.name.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query)
    )
  })

  const stats = {
    total: initialCars.length,
    rented: initialCars.filter(
      (car) => car.status === 'Disewa'
    ).length,
    available: initialCars.filter(
      (car) => car.status === 'Tersedia'
    ).length,
    uniqueBrands: new Set(
      initialCars.map((car) => car.brand)
    ).size,
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans relative pb-20">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 glass border-b border-neutral-800 bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center animate-slideUp">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white transition text-sm"
          >
            &larr; Kembali ke Garasi
          </Link>

          <h1 className="font-serif text-xl tracking-wide text-white">
            Hidayat{' '}
            <span className="text-gold-gradient text-[#E6D5B8]">
              Admin
            </span>
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 stagger-children">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
          <StatCard
            title="Total Armada"
            value={stats.total}
            emoji="🚗"
          />

          <StatCard
            title="Sedang Disewa"
            value={stats.rented}
            emoji="🔑"
          />

          <StatCard
            title="Unit Tersedia"
            value={stats.available}
            emoji="✅"
          />

          <StatCard
            title="Merek Unik"
            value={stats.uniqueBrands}
            emoji="🏷️"
          />
        </div>

        {/* TAB */}
        <div className="flex gap-1 mb-6 bg-[#121212] border border-neutral-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('armada')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'armada'
                ? 'bg-[#E6D5B8] text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🚗 Armada
          </button>

          <button
            onClick={() => setActiveTab('transaksi')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'transaksi'
                ? 'bg-[#E6D5B8] text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            📋 Transaksi

            {initialBookings.length > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'transaksi'
                    ? 'bg-black/20 text-black'
                    : 'bg-[#E6D5B8]/20 text-[#E6D5B8]'
                }`}
              >
                {initialBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* TRANSAKSI */}
        {activeTab === 'transaksi' && (
          <div className="bg-[#121212] border border-neutral-800 rounded-xl overflow-hidden animate-fadeIn shadow-2xl mb-8">

            <div className="p-6 border-b border-neutral-800">
              <h2 className="font-serif text-lg text-white">
                Riwayat Transaksi & Booking
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A0A0A] text-neutral-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Pelanggan</th>
                    <th className="p-4 font-medium">Kendaraan</th>
                    <th className="p-4 font-medium">Tanggal</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800/50">
                  {initialBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-12 text-center text-neutral-500"
                      >
                        Belum ada transaksi booking.
                      </td>
                    </tr>
                  ) : (
                    initialBookings.map((booking) => {
                      const statusColors: Record<
                        string,
                        string
                      > = {
                        PENDING:
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                        PAID:
                          'bg-green-500/10 text-green-400 border-green-500/20',
                        COMPLETED:
                          'bg-blue-500/10 text-blue-400 border-blue-500/20',
                        CANCELLED:
                          'bg-red-500/10 text-red-400 border-red-500/20',
                      }

                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-neutral-900/50 transition"
                        >
                          <td className="p-4 text-xs font-mono text-[#E6D5B8]">
                            HG-
                            {String(booking.id).padStart(
                              5,
                              '0'
                            )}
                          </td>

                          <td className="p-4">
                            <div className="text-sm text-white font-medium">
                              {booking.customerName}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {booking.customerPhone || '-'}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="text-sm text-white">
                              {booking.car?.name || '-'}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {booking.car?.brand || ''}
                            </div>
                          </td>

                          <td className="p-4 text-xs text-neutral-300">
                            {new Date(
                              booking.startDate
                            ).toLocaleDateString('id-ID')}{' '}
                            —{' '}
                            {new Date(
                              booking.endDate
                            ).toLocaleDateString('id-ID')}
                          </td>

                          <td className="p-4 text-sm text-[#E6D5B8]">
                            {booking.totalPrice || '-'}
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                statusColors[booking.status] ||
                                statusColors.PENDING
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            {booking.status === 'PAID' && (
                              <button
                                onClick={async () => {
                                  await updateBookingStatus(
                                    booking.id,
                                    'COMPLETED'
                                  )
                                  showToast(
                                    'Booking ditandai selesai'
                                  )
                                  router.refresh()
                                }}
                                className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition"
                              >
                                Selesai
                              </button>
                            )}

                            {booking.status === 'PENDING' && (
                              <button
                                onClick={async () => {
                                  await updateBookingStatus(
                                    booking.id,
                                    'CANCELLED'
                                  )
                                  showToast(
                                    'Booking dibatalkan'
                                  )
                                  router.refresh()
                                }}
                                className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition"
                              >
                                Batalkan
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ARMADA */}
        {activeTab === 'armada' && (
          <div className="bg-[#121212] border border-neutral-800 rounded-xl overflow-hidden animate-fadeIn shadow-2xl">

            <div className="p-6 border-b border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">

              <h2 className="font-serif text-lg text-white">
                Manajemen Unit Garasi
              </h2>

              <div className="flex w-full sm:w-auto gap-4">

                <input
                  type="text"
                  placeholder="Cari merek atau model..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="bg-[#0A0A0A] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition flex-grow sm:flex-grow-0 min-w-[250px]"
                />

                <button
                  onClick={() => {
                    setFormData(initialFormData)
                    setIsAddModalOpen(true)
                  }}
                  className="bg-[#E6D5B8] hover:bg-[#b5952f] text-black px-4 py-2 rounded-lg text-sm font-medium transition hover-lift whitespace-nowrap"
                >
                  + Tambah Unit
                </button>

              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-[#0A0A0A] text-neutral-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium w-16">
                      Unit
                    </th>
                    <th className="p-4 font-medium">
                      Merek & Model
                    </th>
                    <th className="p-4 font-medium">
                      Warna
                    </th>
                    <th className="p-4 font-medium">
                      Harga Sewa
                    </th>
                    <th className="p-4 font-medium">
                      Status
                    </th>
                    <th className="p-4 font-medium text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800/50">
                  {filteredCars.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-12 text-center text-neutral-500"
                      >
                        <p className="mb-4">
                          Belum ada unit di garasi yang cocok
                          dengan pencarian.
                        </p>

                        <button
                          onClick={() => {
                            setFormData(initialFormData)
                            setIsAddModalOpen(true)
                          }}
                          className="text-[#E6D5B8] hover:underline"
                        >
                          + Tambah Unit Sekarang
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredCars.map((car) => (
                      <tr
                        key={car.id}
                        className="hover:bg-neutral-900/50 transition group"
                      >
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden relative border border-neutral-800">
                            {car.image ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={car.image}
                                  alt={car.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                🚗
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-medium text-white">
                            {car.brand}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {car.name}
                          </div>
                        </td>

                        <td className="p-4 text-sm text-neutral-300">
                          {car.color || '-'}
                        </td>

                        <td className="p-4 text-sm text-[#E6D5B8]">
                          {car.price}
                        </td>

                        <td className="p-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              car.status === 'Tersedia'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}
                          >
                            <span
                              className={`status-dot w-1.5 h-1.5 rounded-full ${
                                car.status === 'Tersedia'
                                  ? 'bg-green-400'
                                  : 'bg-red-400'
                              }`}
                            />

                            {car.status}
                          </div>
                        </td>

                        <td className="p-4 flex gap-2 justify-end items-center h-full pt-6">

                          <button
                            onClick={() =>
                              handleToggleStatus(
                                car.id,
                                car.status
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
                            title="Ubah Status"
                          >
                            🔄
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(car)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
                            title="Edit"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() =>
                              openDeleteModal(car)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 transition"
                            title="Hapus"
                          >
                            🗑️
                          </button>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODAL TAMBAH */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Unit Baru"
      >
        <CarForm
          formData={formData}
          onChange={handleInputChange}
          setFormData={setFormData}
          onSubmit={handleAddSubmit}
          submitText="Tambah Unit"
          onClose={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* MODAL EDIT */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Unit"
      >
        <CarForm
          formData={formData}
          onChange={handleInputChange}
          setFormData={setFormData}
          onSubmit={handleEditSubmit}
          submitText="Simpan Perubahan"
          onClose={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* MODAL DELETE */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Unit"
      >
        <div className="p-6">

          <p className="text-neutral-300 mb-2">
            Hapus {selectedCar?.brand}{' '}
            {selectedCar?.name}?
          </p>

          <p className="text-red-400 text-sm mb-6">
            Aksi ini tidak dapat dibatalkan.
          </p>

          <div className="flex justify-end gap-3">

            <button
              onClick={() =>
                setIsDeleteModalOpen(false)
              }
              className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 transition"
            >
              Batal
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition"
            >
              Ya, Hapus
            </button>

          </div>
        </div>
      </Modal>

      {/* TOAST */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-scaleIn toast-enter">
          <div className="bg-[#121212] border border-[#E6D5B8]/30 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">

            <span className="bg-green-500/20 text-green-400 p-1 rounded-full text-xs">
              ✓
            </span>

            <span className="text-sm font-medium">
              {toast.message}
            </span>

          </div>
        </div>
      )}

    </div>
  )
}

function StatCard({
  title,
  value,
  emoji,
}: {
  title: string
  value: number
  emoji: string
}) {
  return (
    <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 transition hover-lift relative overflow-hidden group">

      <div className="absolute -right-4 -bottom-4 text-6xl opacity-5 group-hover:scale-110 group-hover:rotate-12 transition duration-500 grayscale">
        {emoji}
      </div>

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">
          {title}
        </h3>

        <span className="text-xl">
          {emoji}
        </span>
      </div>

      <div className="font-serif text-4xl text-white">
        {value}
      </div>
    </div>
  )
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden animate-scaleIn shadow-2xl">

        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#0A0A0A]/50">

          <h2 className="font-serif text-lg text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800"
          >
            ×
          </button>

        </div>

        {children}

      </div>
    </div>
  )
}

function CarForm({
  formData,
  onChange,
  setFormData,
  onSubmit,
  submitText,
  onClose,
  isSubmitting,
}: CarFormProps) {

  const [uploading, setUploading] =
    useState(false)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    if (
      !e.target.files ||
      e.target.files.length === 0
    ) {
      return
    }

    const file = e.target.files[0]

    setUploading(true)

    const data = new FormData()
    data.append('file', file)

    try {

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()

      if (result.url) {
        setFormData((prev) => ({
          ...prev,
          image: result.url,
        }))
      }

    } catch (error) {

      console.error(
        'Upload failed',
        error
      )

      alert(
        'Gagal mengupload foto'
      )

    } finally {

      setUploading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="p-6 max-h-[80vh] overflow-y-auto"
    >

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Merek *
          </label>

          <input
            required
            name="brand"
            value={formData.brand}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: Ferrari"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Model *
          </label>

          <input
            required
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: SF90 Stradale"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Warna
          </label>

          <input
            name="color"
            value={formData.color}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: Rosso Corsa"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Harga Sewa / Hari *
          </label>

          <input
            required
            name="price"
            value={formData.price}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: Rp 35.000.000 / Hari"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Tenaga (HP)
          </label>

          <input
            name="horsepower"
            value={formData.horsepower}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: 770 HP"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Akselerasi (0-100)
          </label>

          <input
            name="acceleration"
            value={formData.acceleration}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: 2.8s"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Mesin
          </label>

          <input
            name="engine"
            value={formData.engine}
            onChange={onChange}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition"
            placeholder="Misal: V12 6.5L Naturally Aspirated"
          />
        </div>

        {/* FOTO */}
        <div className="sm:col-span-2">

          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Foto Unit
          </label>

          <div className="flex gap-4 items-center">

            {formData.image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-neutral-800"
                />
              </>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition"
              disabled={uploading}
            >
              {uploading
                ? 'Mengupload...'
                : 'Pilih Foto dari Komputer'}
            </button>

          </div>

          {formData.image && (
            <p className="text-[10px] text-neutral-500 mt-2 truncate">
              {formData.image}
            </p>
          )}

        </div>

        {/* DESKRIPSI */}
        <div className="sm:col-span-2">

          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
            Deskripsi Singkat
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={3}
            className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E6D5B8] transition resize-none"
            placeholder="Tulis deskripsi singkat tentang mobil ini..."
          />

        </div>

      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800 mt-2">

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 transition"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-[#E6D5B8] hover:bg-[#b5952f] text-black px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {isSubmitting
            ? 'Menyimpan...'
            : submitText}
        </button>

      </div>
    </form>
  )
}