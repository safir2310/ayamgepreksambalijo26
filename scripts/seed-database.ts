import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const db = new PrismaClient()

async function seedDatabase() {
  try {
    await db.$connect()
    console.log('✅ Database connected')

    // Read export file
    const exportFile = fs.readFileSync('database-export.json', 'utf-8')
    const data = JSON.parse(exportFile)

    console.log(`📊 Import Statistics from export:`)
    console.log(`   Users: ${data.statistics.users}`)
    console.log(`   Products: ${data.statistics.products}`)
    console.log(`   Transactions: ${data.statistics.transactions}`)
    console.log(`   Point Products: ${data.statistics.pointProducts}`)
    console.log(`   Carts: ${data.statistics.carts}`)

    // Seed Users
    if (data.data.users.length > 0) {
      console.log(`\n👤 Seeding ${data.data.users.length} users...`)
      for (const user of data.data.users) {
        try {
          await db.user.upsert({
            where: { userId: user.userId },
            update: {},
            create: {
              userId: user.userId,
              userIdNum: user.userIdNum,
              username: user.username,
              password: user.password,
              email: user.email,
              phone: user.phone,
              role: user.role,
              address: user.address,
              dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
              points: user.points,
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt)
            }
          })
          console.log(`   ✓ User: ${user.username}`)
        } catch (error) {
          console.error(`   ✗ Failed: ${user.username}`, error)
        }
      }
    }

    // Seed Products
    if (data.data.products.length > 0) {
      console.log(`\n🍔 Seeding ${data.data.products.length} products...`)
      for (const product of data.data.products) {
        try {
          await db.product.upsert({
            where: { productId: product.productId },
            update: {},
            create: {
              productId: product.productId,
              name: product.name,
              description: product.description,
              image: product.image,
              price: product.price,
              discount: product.discount,
              category: product.category,
              status: product.status,
              stock: product.stock,
              createdAt: new Date(product.createdAt),
              updatedAt: new Date(product.updatedAt)
            }
          })
          console.log(`   ✓ Product: ${product.name}`)
        } catch (error) {
          console.error(`   ✗ Failed: ${product.name}`, error)
        }
      }
    }

    // Seed Transactions
    if (data.data.transactions.length > 0) {
      console.log(`\n🛒 Seeding ${data.data.transactions.length} transactions...`)
      for (const tx of data.data.transactions) {
        try {
          // Create transaction
          const createdTx = await db.transaction.upsert({
            where: { transactionId: tx.transactionId },
            update: {},
            create: {
              transactionId: tx.transactionId,
              transactionIdNum: tx.transactionIdNum,
              userId: tx.userId,
              type: tx.type,
              status: tx.status,
              total: tx.total,
              pointsEarned: tx.pointsEarned,
              address: tx.address,
              createdAt: new Date(tx.createdAt),
              updatedAt: new Date(tx.updatedAt)
            }
          })
          console.log(`   ✓ Transaction #${tx.transactionIdNum}`)

          // Seed transaction items
          for (const item of tx.items) {
            await db.transactionItem.upsert({
              where: { id: item.id },
              update: {},
              create: {
                id: item.id,
                transactionId: item.transactionId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
              }
            })
          }
        } catch (error) {
          console.error(`   ✗ Failed: Transaction #${tx.transactionIdNum}`, error)
        }
      }
    }

    // Seed Point Products
    if (data.data.pointProducts.length > 0) {
      console.log(`\n🎁 Seeding ${data.data.pointProducts.length} point products...`)
      for (const pp of data.data.pointProducts) {
        try {
          await db.pointProduct.upsert({
            where: { productId: pp.productId },
            update: {},
            create: {
              productId: pp.productId,
              name: pp.name,
              description: pp.description,
              image: pp.image,
              pointsRequired: pp.pointsRequired,
              stock: pp.stock,
              createdAt: new Date(pp.createdAt),
              updatedAt: new Date(pp.updatedAt)
            }
          })
          console.log(`   ✓ Point Product: ${pp.name}`)
        } catch (error) {
          console.error(`   ✗ Failed: ${pp.name}`, error)
        }
      }
    }

    // Seed Carts
    if (data.data.carts.length > 0) {
      console.log(`\n🛒 Seeding ${data.data.carts.length} carts...`)
      for (const cart of data.data.carts) {
        try {
          await db.cart.upsert({
            where: { cartId: cart.cartId },
            update: {},
            create: {
              cartId: cart.cartId,
              userId: cart.userId,
              createdAt: new Date(cart.createdAt),
              updatedAt: new Date(cart.updatedAt)
            }
          })
          console.log(`   ✓ Cart: ${cart.cartId}`)

          // Seed cart items
          for (const item of cart.items) {
            await db.cartItem.upsert({
              where: { id: item.id },
              update: {},
              create: {
                id: item.id,
                cartId: item.cartId,
                productId: item.productId,
                quantity: item.quantity,
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt)
              }
            })
          }
        } catch (error) {
          console.error(`   ✗ Failed: Cart ${cart.cartId}`, error)
        }
      }
    }

    console.log('\n✅ Database seeding completed!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

seedDatabase()
