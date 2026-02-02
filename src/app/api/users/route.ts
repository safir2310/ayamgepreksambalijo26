import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all users
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        userId: true,
        userIdNum: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        points: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil users' },
      { status: 500 }
    )
  }
}

// PUT update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, phone, address, points } = body

    const user = await db.user.update({
      where: { userId },
      data: {
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(points !== undefined && { points })
      }
    })

    return NextResponse.json({
      message: 'User berhasil diupdate',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate user' },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { userId }
    })

    return NextResponse.json({
      message: 'User berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus user' },
      { status: 500 }
    )
  }
}
