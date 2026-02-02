'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, ShoppingBag, Gift, Users, Receipt, LogOut, Plus, Edit, Trash2, Menu as MenuIcon, X, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

type AdminTabType = 'products' | 'point-products' | 'users' | 'transactions'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTabType>('products')
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [pointProducts, setPointProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const fetchData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchPointProducts(),
      fetchUsers(),
      fetchTransactions()
    ])
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    // Using setTimeout to avoid setting state synchronously in effect
    setTimeout(() => {
      setUser(parsedUser)
      fetchData()
    }, 0)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status })
      })
      if (response.ok) {
        await fetchTransactions()
        alert('Status berhasil diupdate')
      }
    } catch (error) {
      console.error('Update transaction status error:', error)
      alert('Gagal mengupdate status')
    }
  }

  const tabs = [
    { id: 'products' as AdminTabType, label: 'Produk', icon: ShoppingBag },
    { id: 'point-products' as AdminTabType, label: 'Produk Point', icon: Gift },
    { id: 'users' as AdminTabType, label: 'Users', icon: Users },
    { id: 'transactions' as AdminTabType, label: 'Transaksi', icon: Receipt }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-orange-50 flex flex-col">
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
                <p className="text-xs text-orange-400 font-semibold">SAMBAL IJO - ADMIN</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">{user.username}</p>
                <p className="text-sm text-orange-600">Administrator</p>
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

      <div className="container mx-auto px-4 py-6 pb-24 flex-1">
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
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Produk</h2>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 btn-interaction">
                      <Plus className="w-5 h-5" />
                      Tambah Produk
                    </button>
                  </div>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.productId} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-600">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'point-products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Produk Point</h2>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 btn-interaction">
                      <Plus className="w-5 h-5" />
                      Tambah Produk Point
                    </button>
                  </div>
                  <div className="space-y-4">
                    {pointProducts.map((product) => (
                      <div key={product.productId} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-orange-600">{product.pointsRequired} point</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola User</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">ID User</th>
                          <th className="text-left py-3 px-4">Username</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">No HP</th>
                          <th className="text-left py-3 px-4">Point</th>
                          <th className="text-left py-3 px-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((userItem) => (
                          <tr key={userItem.userId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-orange-600">
                              {String(userItem.userIdNum).padStart(4, '0')}
                            </td>
                            <td className="py-3 px-4">{userItem.username}</td>
                            <td className="py-3 px-4">{userItem.email}</td>
                            <td className="py-3 px-4">{userItem.phone}</td>
                            <td className="py-3 px-4 font-semibold text-orange-600">{userItem.points}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Transaksi</h2>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.transactionId} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-orange-600">
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
                              {transaction.user?.username} - {transaction.user?.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={transaction.status}
                              onChange={(e) => updateTransactionStatus(transaction.transactionId, e.target.value)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                transaction.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <option value="waiting">Menunggu</option>
                              <option value="processing">Diproses</option>
                              <option value="completed">Selesai</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">🔥🔥</h3>
            <p className="text-lg font-semibold italic">
              "Pedasnya Bikin Nagih"
            </p>
          </div>
          <div className="text-center text-sm mb-4">
            <p>Lokasi: Jl. Medan – Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 2415</p>
            <p>No HP: 085260812758</p>
          </div>
          <div className="border-t border-orange-400 pt-6">
            <p>© 2024 AYAM GEPREK SAMBAL IJO. Admin Dashboard.</p>
          </div>
        </div>
      </footer>

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
