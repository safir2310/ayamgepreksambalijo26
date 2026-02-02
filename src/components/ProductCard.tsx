'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  description: string
  image: string
  price: number
  discount: number
  status: string
  stock: number
  onAddToCart?: (product: any) => void
}

export default function ProductCard({
  id,
  name,
  description,
  image,
  price,
  discount,
  status,
  stock,
  onAddToCart
}: ProductCardProps) {
  const finalPrice = discount > 0 ? price - (price * discount / 100) : price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-orange-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Status Badge */}
        {status === 'promo' && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            PROMO
          </span>
        )}
        {status === 'new' && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BARU
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Price */}
        <div className="mb-3">
          {discount > 0 && (
            <p className="text-gray-400 line-through text-sm">
              Rp {price.toLocaleString('id-ID')}
            </p>
          )}
          <p className="text-orange-600 font-bold text-xl">
            Rp {finalPrice.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Add to Cart Button */}
        {stock > 0 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart?.({ id, name, price: finalPrice, image })}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors btn-interaction"
          >
            <ShoppingCart className="w-5 h-5" />
            Tambah
          </motion.button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
          >
            Stok Habis
          </button>
        )}
      </div>
    </motion.div>
  )
}
