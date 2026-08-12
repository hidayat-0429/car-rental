import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const INITIAL_CARS = [
  {
    brand: "LAMBORGHINI",
    name: "Aventador SVJ",
    color: "Bianco Monocerus (Putih)",
    price: "35.000.000",
    topSpeed: "350 km/h",
    transmission: "7-Speed ISR",
    status: "Disewa",
    image: "https://images.unsplash.com/photo-1627454820516-dc76715ea637?q=80&w=800&auto=format&fit=crop",
    horsepower: "770 HP",
    acceleration: "2.8s",
    engine: "V12 6.5L Naturally Aspirated",
    description: "Puncak evolusi Aventador dengan aerodinamika aktif ALA 2.0. Supercar bertenaga V12 paling agresif yang pernah dibuat Lamborghini, menggabungkan performa trek dengan kemewahan jalanan.",
    seats: 2,
  },
  {
    brand: "PAGANI",
    name: "Huayra Roadster",
    color: "Nero Carbonio (Hitam)",
    price: "85.000.000",
    topSpeed: "383 km/h",
    transmission: "7-Speed AMT",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop",
    horsepower: "764 HP",
    acceleration: "2.8s",
    engine: "V12 Twin-Turbo 6.0L AMG",
    description: "Mahakarya Horacio Pagani yang menggabungkan seni Italia dengan rekayasa Jerman. Setiap detail dipahat dengan tangan, menjadikannya lebih dari sekadar mobil — ini adalah karya seni bergerak.",
    seats: 2,
  },
  {
    brand: "MCLAREN",
    name: "720S Spider",
    color: "Papaya Orange",
    price: "30.000.000",
    topSpeed: "341 km/h",
    transmission: "7-Speed DCT",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1620882814836-96fc37482d8c?q=80&w=800&auto=format&fit=crop",
    horsepower: "710 HP",
    acceleration: "2.9s",
    engine: "V8 Twin-Turbo 4.0L",
    description: "Kombinasi sempurna antara kenyamanan grand touring dan performa supercar murni. Atap retractable memberi pengalaman berkendara terbuka dengan sensasi kecepatan yang tak tertandingi.",
    seats: 2,
  },
  {
    brand: "FERRARI",
    name: "SF90 Stradale",
    color: "Rosso Corsa (Merah)",
    price: "45.000.000",
    topSpeed: "340 km/h",
    transmission: "8-Speed DCT",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop",
    horsepower: "986 HP",
    acceleration: "2.5s",
    engine: "V8 Hybrid PHEV 4.0L",
    description: "Ferrari paling bertenaga dalam sejarah produksi. Teknologi hybrid dari Formula 1 menghasilkan hampir 1000 HP, menjadikannya simbol masa depan hypercar — cepat, efisien, dan brutal.",
    seats: 2,
  },
  {
    brand: "PORSCHE",
    name: "911 GT3 RS",
    color: "Python Green",
    price: "25.000.000",
    topSpeed: "296 km/h",
    transmission: "7-Speed PDK",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop",
    horsepower: "518 HP",
    acceleration: "3.2s",
    engine: "Flat-6 4.0L Naturally Aspirated",
    description: "Mesin aspirasi alami Flat-6 yang berputar hingga 9.000 RPM — pengalaman mengemudi paling murni yang bisa Anda rasakan. Lahir dari motorsport, disempurnakan untuk jalanan.",
    seats: 2,
  },
  {
    brand: "BUGATTI",
    name: "Chiron Sport",
    color: "Atlantic Blue",
    price: "150.000.000",
    topSpeed: "420 km/h",
    transmission: "7-Speed DCT",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop",
    horsepower: "1.500 HP",
    acceleration: "2.4s",
    engine: "W16 Quad-Turbo 8.0L",
    description: "Puncak absolut rekayasa otomotif. Mesin W16 dengan empat turbocharger menghasilkan tenaga 1.500 HP. Bukan sekadar mobil tercepat — ini adalah monumen kecepatan yang tak terjangkau.",
    seats: 2,
  },
]

async function main() {
  console.log('Start seeding...')
  for (const car of INITIAL_CARS) {
    const carCreated = await prisma.car.create({
      data: car
    })
    console.log(`Created car with id: ${carCreated.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
