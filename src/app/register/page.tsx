'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, User, Lock, Mail, Phone, ArrowLeft, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    verificationCode: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok!')
      return
    }

    setIsLoading(true)

    try {
      const payload = role === 'admin'
        ? {
            ...formData,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
            verificationCode: formData.verificationCode
          }
        : formData

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, role })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.')
        router.push('/login')
      } else {
        alert(data.error || 'Registrasi gagal. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-orange-50 flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChefHat className="w-16 h-16 mx-auto text-orange-600 animate-float" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Daftar</h1>
            <p className="text-gray-600 mt-2">Buat akun baru</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                role === 'user'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Masukkan email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. HP
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Masukkan no. HP"
                />
              </div>
            </div>

            {/* Address (User Only) */}
            {role === 'user' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  rows={2}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            )}

            {/* Date of Birth (Admin Only) */}
            {role === 'admin' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      required={role === 'admin'}
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Verifikasi
                  </label>
                  <input
                    type="text"
                    required={role === 'admin'}
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    placeholder="6 digit angka tanggal lahir"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gunakan 6 digit tanggal lahir (tanpa tanda apapun)
                  </p>
                </div>
              </>
            )}

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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Konfirmasi password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed btn-interaction mt-6"
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Login sekarang
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
