import { db } from '../src/lib/db'

const products = [
  {
    name: 'Ayam Geprek Sambal Ijo',
    description: 'Ayam goreng crispy dengan sambal ijo pedas yang bikin nagih. Disajikan dengan nasi putih hangat.',
    image: '/products/ayam-geprek-sambal-ijo.png',
    price: 25000,
    discount: 0,
    category: 'food',
    status: 'promo',
    stock: 50
  },
  {
    name: 'Ayam Geprek Sambal Merah',
    description: 'Ayam goreng crispy dengan sambal merah yang gurih dan pedas. Cocok untuk penggemar sambal.',
    image: '/products/ayam-geprek-sambal-merah.png',
    price: 25000,
    discount: 10,
    category: 'food',
    status: 'new',
    stock: 50
  },
  {
    name: 'Ayam Geprek Original',
    description: 'Ayam geprek classic tanpa sambal, porsinya besar dan mengenyangkan.',
    image: '/products/ayam-geprek-original.png',
    price: 22000,
    discount: 0,
    category: 'food',
    status: 'regular',
    stock: 50
  },
  {
    name: 'Nasi Putih',
    description: 'Nasi putih hangat, cocok untuk menemani menu ayam geprek Anda.',
    image: '/products/nasi-putih.png',
    price: 5000,
    discount: 0,
    category: 'food',
    status: 'regular',
    stock: 100
  },
  {
    name: 'Es Teh Manis',
    description: 'Es teh manis yang menyegarkan, cocok untuk menghilangkan rasa pedas.',
    image: '/products/es-teh-manis.png',
    price: 5000,
    discount: 0,
    category: 'drink',
    status: 'regular',
    stock: 100
  },
  {
    name: 'Es Jeruk',
    description: 'Es jeruk segar dengan rasa asam yang pas, sangat menyegarkan.',
    image: '/products/es-jeruk.png',
    price: 8000,
    discount: 0,
    category: 'drink',
    status: 'regular',
    stock: 80
  },
  {
    name: 'Ayam Bakar',
    description: 'Ayam bakar dengan bumbu kecap manis yang meresap sempurna. Disajikan dengan lalapan.',
    image: '/products/ayam-bakar.png',
    price: 28000,
    discount: 5,
    category: 'food',
    status: 'promo',
    stock: 40
  },
  {
    name: 'Tahu Tempe Goreng',
    description: 'Gorengan tahu dan tempe yang renyah, cocok sebagai pelengkap menu.',
    image: '/products/tahu-tempe-goreng.png',
    price: 5000,
    discount: 0,
    category: 'food',
    status: 'regular',
    stock: 100
  }
]

async function seedProducts() {
  console.log('🌱 Seeding products to database...\n')

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    try {
      await db.product.create({
        data: product
      })
      console.log(`✓ Added: ${product.name}`)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⊘ Skipped (already exists): ${product.name}`)
      } else {
        console.error(`✗ Failed to add ${product.name}:`, error.message)
      }
    }
  }

  console.log('\n✅ Product seeding complete!')
}

seedProducts()
  .catch(console.error)
  .finally(() => {
    process.exit(0)
  })
