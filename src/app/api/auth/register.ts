import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log registration attempt
    console.log('Registration attempt:', {
      username: body.username,
      email: body.email,
      phone: body.phone,
      role: body.role,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    })

    // Check if role is admin
    if (body.role === 'admin') {
      // Admin verification code validation (6 digit from date of birth)
      if (!body.verificationCode || !body.dateOfBirth) {
        console.log('❌ Registration failed: Missing admin verification')
        return NextResponse.json(
          { error: 'Kode verifikasi dan tanggal lahir diperlukan untuk admin' },
          { status: 400 }
        )
      }

      // Verify that dateOfBirth is valid
      const dob = new Date(body.dateOfBirth)
      if (isNaN(dob.getTime())) {
        console.log('❌ Registration failed: Invalid date of birth')
        return NextResponse.json(
          { error: 'Format tanggal lahir tidak valid' },
          { status: 400 }
        )
      }

      // Verify verification code matches date of birth (6 digits: ddmmyy)
      const day = String(dob.getDate()).padStart(2, '0')
      const month = String(dob.getMonth() + 1).padStart(2, '0')
      const year = String(dob.getFullYear()).slice(-2)
      const expectedCode = `${day}${month}${year}`

      if (body.verificationCode !== expectedCode) {
        console.log('❌ Registration failed: Invalid verification code', {
          expected: expectedCode,
          provided: body.verificationCode
        })
        return NextResponse.json(
          { error: 'Kode verifikasi tidak valid. Gunakan format ddmmyy (contoh: 250125)' },
          { status: 400 }
        )
      }
    }

    // User specific validation
    if (body.role === 'user') {
      if (!body.address) {
        console.log('❌ Registration failed: Missing user address')
        return NextResponse.json(
          { error: 'Alamat wajib diisi untuk user' },
          { status: 400 }
        )
      }
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: body.username }
    })

    if (existingUsername) {
      console.log('❌ Registration failed: Username already exists')
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: body.email }
    })

    if (existingEmail) {
      console.log('❌ Registration failed: Email already exists')
      return NextResponse.json(
        { error: `Email sudah digunakan oleh user dengan username: ${existingEmail.username}` },
        { status: 400 }
      )
    }

    // Check if phone already exists (optional but helpful)
    const existingPhone = await db.user.findFirst({
      where: { phone: body.phone }
    })

    if (existingPhone) {
      console.log('❌ Registration failed: Phone already exists')
      return NextResponse.json(
        { error: `Nomor HP sudah digunakan oleh user dengan username: ${existingPhone.username}` },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Generate 4-digit user ID
    let userIdNum: number
    let isUnique = false

    while (!isUnique) {
      userIdNum = Math.floor(Math.random() * 9000) + 1000
      const existingId = await db.user.findUnique({
        where: { userIdNum }
      })
      if (!existingId) {
        isUnique = true
      }
    }

    console.log('✅ Creating user with userIdNum:', userIdNum)

    // Create user
    const user = await db.user.create({
      data: {
        userIdNum: userIdNum!,
        username: body.username,
        password: hashedPassword,
        email: body.email,
        phone: body.phone,
        role: body.role || 'user',
        address: body.role === 'user' ? body.address : null,
        dateOfBirth: body.role === 'admin' ? new Date(body.dateOfBirth) : null,
        points: 0
      },
      select: {
        userId: true,
        userIdNum: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        points: true
      }
    })

    console.log('✅ Registration successful for user:', body.username)

    return NextResponse.json(
      { message: 'Registrasi berhasil', user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Registration error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      cause: error.cause,
      stack: error.stack,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      env: process.env.NODE_ENV,
      databaseUrlPreview: process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.substring(0, 30)}...` : 'not set'
    })

    // Return more specific error message
    let errorMessage = 'Terjadi kesalahan saat registrasi. Silakan coba lagi.'

    if (error.code === 'P2021') {
      errorMessage = 'Database connection failed. Pastikan DATABASE_URL sudah di-set di Vercel Environment Variables.'
    } else if (error.code === 'P2002') {
      // Unique constraint violation
      if (error.meta?.target?.includes('email')) {
        errorMessage = 'Email sudah digunakan'
      } else if (error.meta?.target?.includes('username')) {
        errorMessage = 'Username sudah digunakan'
      } else if (error.meta?.target?.includes('phone')) {
        errorMessage = 'Nomor HP sudah digunakan'
      } else {
        errorMessage = 'Username, email, atau nomor HP sudah digunakan'
      }
    } else if (error.code === 'P2025') {
      errorMessage = 'Data tidak ditemukan'
    } else if (error.code === 'P2024') {
      errorMessage = 'Format tanggal lahir tidak valid'
    } else if (error.message) {
      errorMessage = error.message
    }

    console.log('❌ Returning error:', errorMessage)

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
