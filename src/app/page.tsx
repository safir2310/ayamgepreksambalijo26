'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, User, UtensilsCrossed, ChefHat, Instagram, Facebook, Phone, MapPin, Menu as MenuIcon, X } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-400 via-orange-300 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                className="text-4xl text-orange-500 animate-float"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChefHat className="w-12 h-12" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-orange-600">AYAM GEPREK</h1>
                <p className="text-sm text-orange-400 font-semibold">SAMBAL IJO</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Beranda
              </Link>
              <Link href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Menu
              </Link>
              <Link href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Promo
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="relative btn-interaction">
                <User className="w-6 h-6 text-orange-600 hover:text-orange-700 transition-colors" />
              </Link>
              <Link href="/cart" className="relative btn-interaction">
                <ShoppingCart className="w-6 h-6 text-orange-600 hover:text-orange-700 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden btn-interaction"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6 text-orange-600" /> : <MenuIcon className="w-6 h-6 text-orange-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-orange-200"
            >
              <div className="flex flex-col gap-4 pt-4">
                <Link href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  Beranda
                </Link>
                <Link href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  Menu
                </Link>
                <Link href="#" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  Promo
                </Link>
              </div>
            </motion.nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-24 h-24 bg-orange-600 rounded-full"
              animate={{ scale: [1, 1.3, 1], rotate: [360, 0, -360] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <ChefHat className="w-20 h-20 mx-auto text-orange-600 animate-float" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold text-gray-800 mb-4"
              >
                AYAM GEPREK
                <span className="block text-orange-600">SAMBAL IJO</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-block mb-6"
              >
                <span className="text-2xl md:text-3xl font-bold text-orange-500 chili-blink">
                  🌶️ Pedasnya Bikin Nagih 🔥
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-lg md:text-xl text-gray-700 mb-8"
              >
                Nikmati kelezatan ayam geprek dengan sambal ijo autentik yang bikin lidah bergoyang.
                Pesan sekarang dan rasakan sensasi pedas yang tak terlupakan!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/login"
                  className="btn-interaction bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Pesan Sekarang
                  </span>
                </Link>
                <Link
                  href="#menu"
                  className="btn-interaction bg-white hover:bg-orange-50 text-orange-600 px-8 py-4 rounded-full font-semibold text-lg border-2 border-orange-600 shadow-lg hover:shadow-xl transition-all"
                >
                  Lihat Menu
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
            >
              Kenapa Pilih Kami?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <UtensilsCrossed className="w-12 h-12" />,
                  title: 'Rasa Otentik',
                  description: 'Sambal ijo dengan resep warisan keluarga yang bikin nagih.'
                },
                {
                  icon: <ChefHat className="w-12 h-12" />,
                  title: 'Kualitas Terbaik',
                  description: 'Ayam segar pilihan dengan bumbu rempah terbaik.'
                },
                {
                  icon: <ShoppingCart className="w-12 h-12" />,
                  title: 'Pesan Mudah',
                  description: 'Pesanan langsung terhubung ke WhatsApp dengan cepat.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="card-hover bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl text-center shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-600 text-white p-4 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Hubungi Kami</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <a href="https://wa.me/6285260812758" className="hover:text-orange-200 transition-colors">
                    085260812758
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1" />
                  <p className="text-sm">
                    Jl. Medan – Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="btn-interaction bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="btn-interaction bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Tagline */}
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold mb-2">🔥🔥</h3>
              <p className="text-lg font-semibold italic">
                "Pedasnya Bikin Nagih"
              </p>
            </div>
          </div>

          <div className="border-t border-orange-400 pt-6 text-center text-sm">
            <p>© 2024 AYAM GEPREK SAMBAL IJO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
