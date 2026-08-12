import { getCars, getBookings } from '../actions'
import AdminClientPage from './client-page'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  const cars = await getCars()
  const bookings = await getBookings()
  return <AdminClientPage initialCars={cars} initialBookings={JSON.parse(JSON.stringify(bookings))} />
}
