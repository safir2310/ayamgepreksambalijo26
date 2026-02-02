import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { productId: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil produk' },
      { status: 500 }
    )
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const product = await db.product.update({
      where: { productId: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.discount !== undefined && { discount: body.discount }),
        ...(body.category && { category: body.category }),
        ...(body.status && { status: body.status }),
        ...(body.stock !== undefined && { stock: body.stock })
      }
    })

    return NextResponse.json({
      message: 'Produk berhasil diupdate',
      product
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate produk' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.product.delete({
      where: { productId: params.id }
    })

    return NextResponse.json({
      message: 'Produk berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus produk' },
      { status: 500 }
    )
  }
}
