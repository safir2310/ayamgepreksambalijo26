import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

async function exportDatabase() {
  try {
    await db.$connect()
    console.log('✅ Database connected')

    // Get all data
    const users = await db.user.findMany()
    const products = await db.product.findMany()
    const transactions = await db.transaction.findMany({
      include: { items: true }
    })
    const pointProducts = await db.pointProduct.findMany()
    const carts = await db.cart.findMany({
      include: { items: true }
    })

    console.log(`📊 Export Statistics:`)
    console.log(`   Users: ${users.length}`)
    console.log(`   Products: ${products.length}`)
    console.log(`   Transactions: ${transactions.length}`)
    console.log(`   Point Products: ${pointProducts.length}`)
    console.log(`   Carts: ${carts.length}`)

    // Create export object
    const databaseExport = {
      exportedAt: new Date().toISOString(),
      statistics: {
        users: users.length,
        products: products.length,
        transactions: transactions.length,
        pointProducts: pointProducts.length,
        carts: carts.length
      },
      data: {
        users: users.map(user => ({
          userId: user.userId,
          userIdNum: user.userIdNum,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          points: user.points,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })),
        products: products.map(product => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price,
          discount: product.discount,
          category: product.category,
          status: product.status,
          stock: product.stock,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        })),
        transactions: transactions.map(tx => ({
          transactionId: tx.transactionId,
          transactionIdNum: tx.transactionIdNum,
          userId: tx.userId,
          type: tx.type,
          status: tx.status,
          total: tx.total,
          pointsEarned: tx.pointsEarned,
          address: tx.address,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
          items: tx.items.map(item => ({
            id: item.id,
            transactionId: item.transactionId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        })),
        pointProducts: pointProducts.map(pp => ({
          productId: pp.productId,
          name: pp.name,
          description: pp.description,
          image: pp.image,
          pointsRequired: pp.pointsRequired,
          stock: pp.stock,
          createdAt: pp.createdAt,
          updatedAt: pp.updatedAt
        })),
        carts: carts.map(cart => ({
          cartId: cart.cartId,
          userId: cart.userId,
          items: cart.items.map(item => ({
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })),
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt
        }))
      }
    }

    // Save to JSON file
    const exportPath = path.join(process.cwd(), 'database-export.json')
    fs.writeFileSync(exportPath, JSON.stringify(databaseExport, null, 2), 'utf-8')

    console.log(`✅ Database exported to: ${exportPath}`)
    console.log(`📁 File size: ${(JSON.stringify(databaseExport).length / 1024).toFixed(2)} KB`)

    // Also create a readable format
    const readablePath = path.join(process.cwd(), 'database-readable.txt')
    let readableContent = '=== DATABASE EXPORT ====\n\n'
    readableContent += `Exported At: ${new Date().toISOString()}\n\n`
    readableContent += '=== USERS ===\n\n'
    users.forEach(user => {
      readableContent += `ID: ${user.userIdNum} | Username: ${user.username} | Email: ${user.email} | Role: ${user.role}\n`
    })
    readableContent += '\n=== PRODUCTS ===\n\n'
    products.forEach(product => {
      readableContent += `${product.name} | ${product.category} | Rp ${product.price.toLocaleString()} | Stock: ${product.stock}\n`
    })
    readableContent += '\n=== TRANSACTIONS ===\n\n'
    transactions.forEach(tx => {
      readableContent += `Order #${tx.transactionIdNum} | User: ${tx.userIdNum} | Total: Rp ${tx.total.toLocaleString()} | Status: ${tx.status}\n`
    })
    
    fs.writeFileSync(readablePath, readableContent, 'utf-8')
    console.log(`✅ Readable export saved to: ${readablePath}`)

  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

exportDatabase()
