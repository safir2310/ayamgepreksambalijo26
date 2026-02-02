import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, address, cartItems } = body

    // Get user data
    const user = await db.user.findUnique({
      where: { userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Generate 4-digit transaction ID
    let transactionIdNum: number
    let isUnique = false

    while (!isUnique) {
      transactionIdNum = Math.floor(Math.random() * 9000) + 1000
      const existingId = await db.transaction.findUnique({
        where: { transactionIdNum }
      })
      if (!existingId) {
        isUnique = true
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Calculate points (1 point per 1000 Rupiah)
    const pointsEarned = Math.floor(total / 1000)

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        transactionIdNum: transactionIdNum!,
        userId,
        type: 'purchase',
        status: 'waiting',
        total,
        pointsEarned,
        address
      }
    })

    // Create transaction items
    for (const item of cartItems) {
      await db.transactionItem.create({
        data: {
          transactionId: transaction.transactionId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      })
    }

    // Clear cart
    const cart = await db.cart.findUnique({
      where: { userId }
    })

    if (cart) {
      await db.cartItem.deleteMany({
        where: { cartId: cart.cartId }
      })
    }

    // Get user's phone number for WhatsApp
    const userPhone = user.phone.startsWith('0') ? '62' + user.phone.slice(1) : user.phone

    // Create WhatsApp message
    const whatsappMessage = `
📋 *ID STRUK: ${String(transactionIdNum).padStart(4, '0')}*
🆔 *ID USER: ${String(user.userIdNum).padStart(4, '0')}*

👤 *Nama:* ${user.username}
📱 *No HP:* ${user.phone}
📍 *Alamat:* ${address}

🍽️ *DETAIL PESANAN:*
${cartItems.map((item: any) => 
  `• ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
).join('\n')}

💰 *TOTAL: Rp ${total.toLocaleString('id-ID')}*
⭐ *Point yang akan didapat: ${pointsEarned}*

🙏 Terima kasih telah memesan di AYAM GEPREK SAMBAL IJO!
🔥 *Pedasnya Bikin Nagih!*
    `.trim()

    const shopPhoneNumber = '6285260812758'
    const whatsappUrl = `https://wa.me/${shopPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`

    return NextResponse.json({
      message: 'Pesanan berhasil dibuat',
      transaction,
      whatsappUrl,
      transactionId: String(transactionIdNum).padStart(4, '0'),
      whatsappMessage
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat checkout' },
      { status: 500 }
    )
  }
}
