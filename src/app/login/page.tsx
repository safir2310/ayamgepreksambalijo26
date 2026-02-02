'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, User, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Login attempt with username:', formData.username)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      console.log('Login response:', data)

      if (response.ok) {
        // Store session
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)

        console.log('Login successful, user stored:', data.user.username)

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        console.error('Login failed:', data.error)
        alert(`Login gagal: ${data.error || 'Silakan coba lagi.'}`)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      alert(`Terjadi kesalahan: ${error.message || 'Silakan coba lagi.'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChefHat className="w-16 h-16 mx-auto text-orange-600 animate-float" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Login</h1>
            <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed btn-interaction"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
