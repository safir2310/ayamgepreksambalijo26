import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all transactions or transactions for a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'purchase' or 'redeem'

    const where: any = {}
    if (userId) {
      where.userId = userId
    }
    if (type) {
      where.type = type
    }

    const transactions = await db.transaction.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            userIdNum: true,
            username: true,
            phone: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil transaksi' },
      { status: 500 }
    )
  }
}

// PUT update transaction status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, status } = body

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: 'Transaction ID dan status diperlukan' },
        { status: 400 }
      )
    }

    // Get current transaction
    const transaction = await db.transaction.findUnique({
      where: { transactionId },
      include: { user: true }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update transaction status
    const updatedTransaction = await db.transaction.update({
      where: { transactionId },
      data: { status }
    })

    // If status is completed, add points to user
    if (status === 'completed' && transaction.type === 'purchase') {
      const newPoints = transaction.user.points + transaction.pointsEarned
      await db.user.update({
        where: { userId: transaction.userId },
        data: { points: newPoints }
      })
    }

    return NextResponse.json({
      message: 'Status transaksi berhasil diupdate',
      transaction: updatedTransaction
    })
  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate transaksi' },
      { status: 500 }
    )
  }
}
