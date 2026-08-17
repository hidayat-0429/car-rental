'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function getCars() {
  return await prisma.car.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getCarById(id: number) {
  return await prisma.car.findUnique({
    where: { id }
  })
}

export async function addCar(data: Prisma.CarCreateInput) {
  await prisma.car.create({
    data
  })
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function updateCar(
  id: number,
  data: Prisma.CarUpdateInput
) {
  await prisma.car.update({
    where: { id },
    data
  })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/car/${id}`)
}

export async function deleteCar(id: number) {
  await prisma.car.delete({
    where: { id }
  })
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function toggleCarStatus(id: number, currentStatus: string) {
  const newStatus = currentStatus === 'Tersedia' ? 'Disewa' : 'Tersedia'

  await prisma.car.update({
    where: { id },
    data: { status: newStatus }
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/car/${id}`)
}

export async function createBooking(data: {
  carId: number
  customerName: string
  customerPhone?: string
  startDate: string
  endDate: string
  notes?: string
  totalPrice?: string
}) {
  const booking = await prisma.booking.create({
    data: {
      carId: data.carId,
      customerName: data.customerName,
      customerPhone: data.customerPhone || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      notes: data.notes || null,
      totalPrice: data.totalPrice || null,
      status: 'PENDING',
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')

  return booking
}

export async function updateBookingStatus(id: number, status: string) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/admin')

  return booking
}

export async function getBookings() {
  return await prisma.booking.findMany({
    include: { car: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBookingsByCarId(carId: number) {
  return await prisma.booking.findMany({
    where: { carId },
    orderBy: { startDate: 'asc' },
  })
}