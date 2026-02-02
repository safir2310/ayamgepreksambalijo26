import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all point products
export async function GET() {
  try {
    const pointProducts = await db.pointProduct.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ pointProducts })
  } catch (error) {
    console.error('Get point products error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil produk point' },
      { status: 500 }
    )
  }
}

// POST create new point product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const pointProduct = await db.pointProduct.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        pointsRequired: body.pointsRequired,
        stock: body.stock || 0
      }
    })

    return NextResponse.json(
      { message: 'Produk point berhasil ditambahkan', pointProduct },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create point product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah produk point' },
      { status: 500 }
    )
  }
}
