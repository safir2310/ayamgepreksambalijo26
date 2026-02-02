import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      )
    }

    // Log login attempt
    console.log('Login attempt:', {
      username: body.username,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    })

    // Find user by username
    const user = await db.user.findUnique({
      where: { username: body.username }
    })

    console.log('User lookup result:', user ? `User found: ${user.username}` : 'User not found')

    if (!user) {
      console.log('❌ Login failed: User not found')
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.password)

    console.log('Password verification:', isValidPassword ? '✅ Valid' : '❌ Invalid')

    if (!isValidPassword) {
      console.log('❌ Login failed: Invalid password')
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Create simple token (in production, use JWT or proper session management)
    const token = Buffer.from(`${user.userId}:${Date.now()}`).toString('base64')

    console.log('✅ Login successful for user:', user.username)

    // Return user data without password
    const userData = {
      userId: user.userId,
      userIdNum: user.userIdNum,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      points: user.points
    }

    return NextResponse.json({
      message: 'Login berhasil',
      user: userData,
      token
    })
  } catch (error: any) {
    console.error('❌ Login error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      cause: error.cause,
      stack: error.stack
    })

    // Return more specific error message
    let errorMessage = 'Terjadi kesalahan saat login. Silakan coba lagi.'

    if (error.code === 'P2025') {
      errorMessage = 'Data tidak ditemukan. Pastikan akun sudah terdaftar.'
    } else if (error.code === 'P1001') {
      errorMessage = 'Database tidak dapat terhubung. Silakan coba lagi.'
    } else if (error.code === 'P2021') {
      errorMessage = 'Database connection failed. Cek environment variables.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
