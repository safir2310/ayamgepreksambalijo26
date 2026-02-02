import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const products = await db.product.findMany({
      where: {
        ...(category && { category }),
        ...(status && { status })
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil produk' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        price: body.price,
        discount: body.discount || 0,
        category: body.category, // 'food' or 'drink'
        status: body.status || 'regular', // 'regular', 'promo', 'new'
        stock: body.stock || 0
      }
    })

    return NextResponse.json(
      { message: 'Produk berhasil ditambahkan', product },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah produk' },
      { status: 500 }
    )
  }
}
