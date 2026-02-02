import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil keranjang' },
      { status: 500 }
    )
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if cart exists for user
    let cart = await db.cart.findUnique({
      where: { userId: body.userId }
    })

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await db.cart.create({
        data: { userId: body.userId }
      })
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId: body.productId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + body.quantity }
      })
      return NextResponse.json({ item: updatedItem })
    } else {
      // Add new item
      const newItem = await db.cartItem.create({
        data: {
          cartId: cart.cartId,
          productId: body.productId,
          quantity: body.quantity
        },
        include: {
          product: true
        }
      })
      return NextResponse.json({ item: newItem }, { status: 201 })
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah ke keranjang' },
      { status: 500 }
    )
  }
}

// DELETE remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID diperlukan' },
        { status: 400 }
      )
    }

    await db.cartItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ message: 'Item dihapus dari keranjang' })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus dari keranjang' },
      { status: 500 }
    )
  }
}
