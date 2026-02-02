import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, address, items } = body

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

    // Calculate total points required
    const totalPointsRequired = items.reduce((sum: number, item: any) => {
      return sum + (item.pointsRequired * item.quantity)
    }, 0)

    // Check if user has enough points
    if (user.points < totalPointsRequired) {
      return NextResponse.json(
        { error: `Point tidak mencukupi. Diperlukan ${totalPointsRequired} point.` },
        { status: 400 }
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

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        transactionIdNum: transactionIdNum!,
        userId,
        type: 'redeem',
        status: 'waiting',
        total: 0, // Point redemption has no monetary value
        pointsEarned: -totalPointsRequired, // Deduct points
        address
      }
    })

    // Create redemption items
    for (const item of items) {
      await db.pointRedemptionItem.create({
        data: {
          transactionId: transaction.transactionId,
          pointProductId: item.pointProductId,
          quantity: item.quantity,
          points: item.pointsRequired
        }
      })
    }

    // Deduct points from user
    await db.user.update({
      where: { userId },
      data: { points: user.points - totalPointsRequired }
    })

    // Create WhatsApp message
    const whatsappMessage = `
📋 *ID STRUK: ${String(transactionIdNum).padStart(4, '0')}*
🆔 *ID USER: ${String(user.userIdNum).padStart(4, '0')}*

👤 *Nama:* ${user.username}
📱 *No HP:* ${user.phone}
📍 *Alamat:* ${address}

🎁 *DETAIL TUKAR POINT:*
${items.map((item: any) => 
  `• ${item.name} x${item.quantity} = ${item.pointsRequired * item.quantity} point`
).join('\n')}

💎 *Total Point: ${totalPointsRequired}*
⭐ *Sisa Point: ${user.points - totalPointsRequired}*

🙏 Terima kasih telah menukar point di AYAM GEPREK SAMBAL IJO!
🔥 *Pedasnya Bikin Nagih!*
    `.trim()

    const shopPhoneNumber = '6285260812758'
    const whatsappUrl = `https://wa.me/${shopPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`

    return NextResponse.json({
      message: 'Penukaran point berhasil',
      transaction,
      whatsappUrl,
      transactionId: String(transactionIdNum).padStart(4, '0'),
      whatsappMessage
    })
  } catch (error) {
    console.error('Redeem points error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menukar point' },
      { status: 500 }
    )
  }
}
