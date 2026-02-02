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
        return NextResponse.json(
          { error: 'Kode verifikasi dan tanggal lahir diperlukan untuk admin' },
          { status: 400 }
        )
      }

      // Verify the verification code matches date of birth (6 digits: ddmmyy)
      const dob = new Date(body.dateOfBirth)
      const day = String(dob.getDate()).padStart(2, '0')
      const month = String(dob.getMonth() + 1).padStart(2, '0')
      const year = String(dob.getFullYear()).slice(-2)
      const expectedCode = `${day}${month}${year}`

      if (body.verificationCode !== expectedCode) {
        return NextResponse.json(
          { error: 'Kode verifikasi tidak valid' },
          { status: 400 }
        )
      }
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: body.username }
    })

    if (existingUsername) {
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
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
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

    return NextResponse.json(
      { message: 'Registrasi berhasil', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}
