'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, User, ShoppingBag, ShoppingCart, Star, Receipt, LogOut, Menu as MenuIcon, X, Filter } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

type TabType = 'profile' | 'menu' | 'cart' | 'point' | 'tukar-point' | 'struk'
type ProductCategory = 'all' | 'food' | 'drink'
type ProductStatus = 'all' | 'promo' | 'new' | 'regular'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('menu')
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [pointProducts, setPointProducts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>('all')
  const [statusFilter, setStatusFilter] = useState<ProductStatus>('all')
  const [redeemCart, setRedeemCart] = useState<any[]>([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))

    // Fetch products
    fetchProducts()
    fetchPointProducts()
    fetchTransactions()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPointProducts = async () => {
    try {
      const response = await fetch('/api/point-products')
      const data = await response.json()
      setPointProducts(data.pointProducts || [])
    } catch (error) {
      console.error('Failed to fetch point products:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?userId=${user?.userId}`)
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const handleAddToCart = (product: any) => {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    // Check if product already in cart
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))

    alert('Produk ditambahkan ke keranjang!')
  }

  const handleAddToRedeemCart = (product: any) => {
    setRedeemCart(prev => {
      const existing = prev.find(item => item.pointProductId === product.productId)
      if (existing) {
        return prev.map(item => 
          item.pointProductId === product.productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, pointProductId: product.productId, quantity: 1 }]
    })
  }

  const filteredProducts = products.filter(product => {
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter
    const statusMatch = statusFilter === 'all' || product.status === statusFilter
    return categoryMatch && statusMatch
  })

  const handleCheckout = async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    if (cart.length === 0) {
      alert('Keranjang Anda kosong!')
      return
    }

    if (!user.address) {
      alert('Mohon lengkapi alamat Anda terlebih dahulu!')
      setActiveTab('profile')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          address: user.address,
          cartItems: cart
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.removeItem('cart')
        window.open(data.whatsappUrl, '_blank')
        alert(`Pesanan berhasil! ID Struk: ${data.transactionId}`)
        setActiveTab('struk')
        fetchTransactions()
      } else {
        alert(data.error || 'Checkout gagal')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Terjadi kesalahan saat checkout')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemPoints = async () => {
    if (redeemCart.length === 0) {
      alert('Belum ada produk yang dipilih!')
      return
    }

    if (!user.address) {
      alert('Mohon lengkapi alamat Anda terlebih dahulu!')
      setActiveTab('profile')
      return
    }

    const totalPoints = redeemCart.reduce((sum: number, item: any) => sum + (item.pointsRequired * item.quantity), 0)

    if (user.points < totalPoints) {
      alert(`Point tidak mencukupi! Diperlukan ${totalPoints} point, Anda punya ${user.points} point.`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          address: user.address,
          items: redeemCart
        })
      })

      const data = await response.json()

      if (response.ok) {
        setRedeemCart([])
        window.open(data.whatsappUrl, '_blank')
        alert(`Penukaran point berhasil! ID Struk: ${data.transactionId}`)
        setUser({ ...user, points: user.points - totalPoints })
        setActiveTab('struk')
        fetchTransactions()
      } else {
        alert(data.error || 'Penukaran point gagal')
      }
    } catch (error) {
      console.error('Redeem points error:', error)
      alert('Terjadi kesalahan saat menukar point')
    } finally {
      setLoading(false)
    }
  }

  const handlePrintReceipt = (transaction: any) => {
    const receiptContent = `
AYAM GEPREK SAMBAL IJO
🌶️ Pedasnya Bikin Nagih! 🔥

ID STRUK: ${String(transaction.transactionIdNum).padStart(4, '0')}
ID USER: ${String(transaction.user.userIdNum).padStart(4, '0')}
Tanggal: ${new Date(transaction.createdAt).toLocaleString('id-ID')}

NAMA: ${transaction.user.username}
NO HP: ${transaction.user.phone}
ALAMAT: ${transaction.address}

${transaction.type === 'purchase' ? 'DETAIL PESANAN:' : 'DETAIL TUKAR POINT:'}
${transaction.items.map((item: any) => {
  const product = item.product || item.pointProduct
  const quantity = item.quantity
  if (transaction.type === 'purchase') {
    return `• ${product.name} x${quantity} = Rp ${(item.price * quantity).toLocaleString('id-ID')}`
  } else {
    return `• ${product.name} x${quantity} = ${item.points * quantity} point`
  }
}).join('\n')}

${transaction.type === 'purchase' 
  ? `TOTAL: Rp ${transaction.total.toLocaleString('id-ID')}\nPOINT YANG AKAN DIPEROLEH: ${transaction.pointsEarned}`
  : `TOTAL POINT: ${Math.abs(transaction.pointsEarned)} point`
}

STATUS: ${transaction.status.toUpperCase()}

Terima kasih telah berbelanja di
AYAM GEPREK SAMBAL IJO!
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Struk - AYAM GEPREK SAMBAL IJO</title>
            <style>
              body {
                font-family: monospace;
                max-width: 400px;
                margin: 20px auto;
                padding: 20px;
                text-align: left;
              }
              .header {
                text-align: center;
                border-bottom: 2px dashed #000;
                padding-bottom: 10px;
                margin-bottom: 10px;
              }
              .footer {
                border-top: 2px dashed #000;
                padding-top: 10px;
                margin-top: 10px;
                text-align: center;
              }
              pre {
                white-space: pre-wrap;
                font-size: 12px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => printWindow.print(), 250)
    }
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'menu' as TabType, label: 'Menu', icon: ShoppingBag },
    { id: 'cart' as TabType, label: 'Keranjang', icon: ShoppingCart },
    { id: 'point' as TabType, label: 'Point', icon: Star },
    { id: 'tukar-point' as TabType, label: 'Tukar Point', icon: Star },
    { id: 'struk' as TabType, label: 'Struk', icon: Receipt }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 mx-auto text-orange-600 animate-float" />
          <p className="mt-4 text-gray-700">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                className="text-4xl text-orange-500"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChefHat className="w-10 h-10" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-orange-600">AYAM GEPREK</h1>
                <p className="text-xs text-orange-400 font-semibold">SAMBAL IJO</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">{user.username}</p>
                <p className="text-sm text-orange-600">ID: {String(user.userIdNum).padStart(4, '0')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-orange-600 hover:bg-orange-100 rounded-full transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
              <button
                className="sm:hidden p-2 text-orange-600 hover:bg-orange-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden mb-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.nav>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-orange-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-orange-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Saya</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                        <p className="text-gray-600">ID: {String(user.userIdNum).padStart(4, '0')}</p>
                        <p className="text-orange-600 font-semibold">Point: {user.points}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <p className="text-gray-800">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">No. HP</label>
                        <p className="text-gray-800">{user.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                        <p className="text-gray-800">{user.address || '-'}</p>
                      </div>
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>

                  {/* Filters */}
                  <div className="mb-6 space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-gray-600 font-medium">Kategori:</span>
                      {(['all', 'food', 'drink'] as ProductCategory[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            categoryFilter === cat
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {cat === 'all' ? 'Semua' : cat === 'food' ? 'Makanan' : 'Minuman'}
                        </button>
                      ))}
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-gray-600 font-medium">Status:</span>
                      {(['all', 'promo', 'new', 'regular'] as ProductStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            statusFilter === status
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {status === 'all' ? 'Semua' : status === 'promo' ? 'Promo' : status === 'new' ? 'Baru' : 'Regular'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Products Grid */}
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Memuat produk...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Tidak ada produk yang ditemukan</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product, index) => (
                        <ProductCard
                          key={product.productId}
                          id={product.productId}
                          name={product.name}
                          description={product.description}
                          image={product.image}
                          price={product.price}
                          discount={product.discount}
                          status={product.status}
                          stock={product.stock}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cart' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Keranjang</h2>
                  {(() => {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
                    if (cart.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Keranjang Anda kosong</p>
                          <button
                            onClick={() => setActiveTab('menu')}
                            className="mt-4 text-orange-600 font-semibold hover:text-orange-700"
                          >
                            Lihat Menu
                          </button>
                        </div>
                      )
                    }

                    const total = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

                    return (
                      <div className="space-y-4">
                        {cart.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-20 h-20 bg-orange-100 rounded-lg flex-shrink-0 relative">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{item.name}</h3>
                              <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-orange-600">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-xl font-bold mb-4">
                            <span>Total:</span>
                            <span className="text-orange-600">Rp {total.toLocaleString('id-ID')}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCheckout}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 btn-interaction"
                          >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.964-.627-.09-1.891.281-2.03.455-.223.222-.362.451-.293.617.07.167.247.438.455.95.325.732.653 1.473.952 2.21.455.708 1.404 1.472 2.19 1.993.742.543 1.504 1.01 3.054 1.451 4.642.443 1.642.82 3.316 1.032 5.03.635 1.727.976 3.465.952 5.296.018 1.083.013 2.165.013 3.248 0 .783-.05 1.568-.138 2.342l-.416 4.272h-4.376v-10.875c0-2.384.553-4.078 1.559-5.22 1.425-1.637 1.559-3.594 1.326-5.616l-.034-1.378h-4.492l.032 1.423c.183 4.035-1.621 7.405-5.421 9.342-2.285 1.16-4.822 1.314-6.794.653-1.953-1.455-4.27-2.518-6.362-2.316-3.034-.321-5.45.458-7.342 1.708-.903 1.223-1.739 3.846-1.739 3.846v12.352h-4.627v-12.352c0-2.064-.504-4.011-1.739-5.547-.881-1.099-2.383-1.739-3.846-1.739-2.258 0-4.234.903-5.392 2.316-.753 1.18-1.139 2.967-1.139 2.967v10.355h-4.602v-10.355c0-3.295 1.031-6.074 3.253-8.343 2.071-2.127 4.881-3.191 8.43-3.191 4.386 0 7.675 1.677 9.868 5.032.582.853.923 2.025 1.025 3.517.142 1.492.295.989.405 2.507.337 3.817z"/>
                            </svg>
                            Checkout ke WhatsApp
                          </motion.button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {activeTab === 'point' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Point Saya</h2>
                  <div className="text-center py-12">
                    <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-16 h-16 text-orange-600 animate-pulse" />
                    </div>
                    <p className="text-4xl font-bold text-orange-600 mb-2">{user.points}</p>
                    <p className="text-gray-600">Total Point</p>
                  </div>
                </div>
              )}

              {activeTab === 'tukar-point' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Tukar Point</h2>
                  {(() => {
                    if (pointProducts.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <p className="text-gray-600">Belum ada produk tukar point</p>
                        </div>
                      )
                    }

                    const totalPoints = redeemCart.reduce((sum: number, item: any) => sum + (item.pointsRequired * item.quantity), 0)

                    return (
                      <div>
                        {/* Point Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          {pointProducts.map((product) => (
                            <div key={product.productId} className="bg-gray-50 rounded-2xl overflow-hidden card-hover">
                              <div className="relative h-48">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  {product.pointsRequired} point
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                                <button
                                  onClick={() => handleAddToRedeemCart(product)}
                                  disabled={product.stock === 0}
                                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white py-2 rounded-xl font-semibold transition-colors btn-interaction"
                                >
                                  {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Penukaran'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Redeem Cart Summary */}
                        {redeemCart.length > 0 && (
                          <div className="bg-orange-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Penukaran Point</h3>
                            <div className="space-y-3 mb-6">
                              {redeemCart.map((item: any) => (
                                <div key={item.pointProductId} className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                    <div>
                                      <p className="font-semibold text-gray-800">{item.name}</p>
                                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="font-bold text-orange-600">{item.pointsRequired * item.quantity} point</p>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-orange-200 pt-4">
                              <div className="flex justify-between items-center text-xl font-bold">
                                <span>Total Point:</span>
                                <span className="text-orange-600">{totalPoints} point</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">Sisa point setelah penukaran: {user.points - totalPoints}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleRedeemPoints}
                              disabled={loading}
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 btn-interaction mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.964-.627-.09-1.891.281-2.03.455-.223.222-.362.451-.293.617.07.167.247.438.455.95.325.732.653 1.473.952 2.21.455.708 1.404 1.472 2.19 1.993.742.543 1.504 1.01 3.054 1.451 4.642.443 1.642.82 3.316 1.032 5.03.635 1.727.976 3.465.952 5.296.018 1.083.013 2.165.013 3.248 0 .783-.05 1.568-.138 2.342l-.416 4.272h-4.376v-10.875c0-2.384.553-4.078 1.559-5.22 1.425-1.637 1.559-3.594 1.326-5.616l-.034-1.378h-4.492l.032 1.423c.183 4.035-1.621 7.405-5.421 9.342-2.285 1.16-4.822 1.314-6.794.653-1.953-1.455-4.27-2.518-6.362-2.316-3.034-.321-5.45.458-7.342 1.708-.903 1.223-1.739 3.846-1.739 3.846v12.352h-4.627v-12.352c0-2.064-.504-4.011-1.739-5.547-.881-1.099-2.383-1.739-3.846-1.739-2.258 0-4.234.903-5.392 2.316-.753 1.18-1.139 2.967-1.139 2.967v10.355h-4.602v-10.355c0-3.295 1.031-6.074 3.253-8.343 2.071-2.127 4.881-3.191 8.43-3.191 4.386 0 7.675 1.677 9.868 5.032.582.853.923 2.025 1.025 3.517.142 1.492.295.989.405 2.507.337 3.817z"/>
                              </svg>
                              {loading ? 'Memproses...' : 'Tukar Point via WhatsApp'}
                            </motion.button>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {activeTab === 'struk' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h2>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Belum ada transaksi</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction: any) => (
                        <div key={transaction.transactionId} className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-orange-600 text-lg">
                                  ID STRUK: {String(transaction.transactionIdNum).padStart(4, '0')}
                                </span>
                                {transaction.type === 'purchase' ? (
                                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    PEMBELIAN
                                  </span>
                                ) : (
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    TUKAR POINT
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.createdAt).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                transaction.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {transaction.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="space-y-2 mb-4">
                              {transaction.items.map((item: any) => {
                                const product = item.product || item.pointProduct
                                return (
                                  <div key={item.id} className="flex justify-between">
                                    <span className="text-gray-700">
                                      {product.name} x{item.quantity}
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                      {transaction.type === 'purchase' 
                                        ? `Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
                                        : `${item.points * item.quantity} point`
                                      }
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold">
                              <span>Total:</span>
                              <span className="text-orange-600">
                                {transaction.type === 'purchase' 
                                  ? `Rp ${transaction.total.toLocaleString('id-ID')}`
                                  : `${Math.abs(transaction.pointsEarned)} point`
                                }
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handlePrintReceipt(transaction)}
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition-colors btn-interaction"
                            >
                              Cetak Struk
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg sm:hidden">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
