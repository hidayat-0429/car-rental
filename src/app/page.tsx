import ClientPage from './client-page'
import { getCars } from './actions'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const cars = await getCars()
  return <ClientPage initialCars={cars} />
}
