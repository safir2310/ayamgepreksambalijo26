'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Trash2, ShoppingBag, Gift, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const notifications = [
    {
      id: '1',
      type: 'order',
      title: 'Pesanan Diproses',
      message: 'Pesanan #ORD-12345 sedang diproses. Mohon tunggu sebentar!',
      time: '2 menit yang lalu',
      unread: true,
      icon: ShoppingBag,
    },
    {
      id: '2',
      type: 'point',
      title: 'Point Bertambah!',
      message: 'Selamat! Anda mendapatkan 50 point dari pesanan terakhir.',
      time: '1 jam yang lalu',
      unread: true,
      icon: Gift,
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Promo Spesial Hari Ini',
      message: 'Diskon 20% untuk semua menu Ayam Geprek Sambal Ijo!',
      time: '3 jam yang lalu',
      unread: false,
      icon: AlertCircle,
    },
    {
      id: '4',
      type: 'system',
      title: 'Sistem Maintenance',
      message: 'Kami akan melakukan maintenance pada tanggal 25 Januari 2025.',
      time: '5 jam yang lalu',
      unread: false,
      icon: Info,
    },
    {
      id: '5',
      type: 'order',
      title: 'Pesanan Selesai',
      message: 'Pesanan #ORD-12340 telah selesai. Terima kasih sudah berbelanja!',
      time: '1 hari yang lalu',
      unread: false,
      icon: ShoppingBag,
    },
    {
      id: '6',
      type: 'point',
      title: 'Poin Redeemed!',
      message: 'Anda berhasil menukarkan 100 poin untuk Nasi Putih Gratis.',
      time: '2 hari yang lalu',
      unread: false,
      icon: Gift,
    },
    {
      id: '7',
      type: 'promotion',
      title: 'Menu Baru Tersedia!',
      message: 'Cobalah menu baru kami: Es Kopi Susu Gula Aren.',
      time: '3 hari yang lalu',
      unread: false,
      icon: AlertCircle,
    },
    {
      id: '8',
      type: 'system',
      title: 'Akun Terdaftar',
      message: 'Selamat datang! Akun Anda telah berhasil dibuat.',
      time: '7 hari yang lalu',
      unread: false,
      icon: Info,
    },
  ]

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.unread)

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-orange-500'
      case 'point':
        return 'text-yellow-500'
      case 'promotion':
        return 'text-red-500'
      default:
        return 'text-blue-500'
    }
  }

  const markAllAsRead = () => {
    // Implementasi mark all as read
    console.log('Mark all as read')
  }

  const deleteAll = () => {
    // Implementasi delete all
    console.log('Delete all notifications')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 py-16 px-4 text-center text-white"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="inline-block mb-4"
        >
          <Bell className="w-16 h-16 mx-auto text-white drop-shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl font-bold mb-2 drop-shadow-md"
        >
          Notifikasi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-orange-100 text-lg drop-shadow-sm"
        >
          Stay updated with all your activities
        </motion.p>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-3 mb-6 justify-center"
        >
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`${
              filter === 'all'
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg'
                : 'border-orange-300 text-orange-700 hover:bg-orange-50'
            } transition-all duration-300`}
          >
            Semua ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            className={`${
              filter === 'unread'
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg'
                : 'border-orange-300 text-orange-700 hover:bg-orange-50'
            } transition-all duration-300 relative`}
          >
            Belum Dibaca ({notifications.filter(n => n.unread).length})
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap gap-3 mb-6 justify-center"
        >
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:shadow-md transition-all duration-300"
          >
            <Check className="w-4 h-4" />
            Tandai Semua Sudah Dibaca
          </Button>
          <Button
            variant="outline"
            onClick={deleteAll}
            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50 hover:shadow-md transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </Button>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="space-y-4"
        >
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center shadow-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-block mb-4"
              >
                <Bell className="w-12 h-12 mx-auto text-gray-400" />
              </motion.div>
              <p className="text-gray-500">Tidak ada notifikasi</p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = notification.icon
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.8 + index * 0.1,
                  }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="cursor-pointer"
                >
                  <Card
                    className={`p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      notification.unread
                        ? 'bg-white border-l-4 border-l-orange-500'
                        : 'bg-gray-50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex gap-4">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                        className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center ${getIconColor(notification.type)}`}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold text-gray-900 ${notification.unread ? 'text-orange-700' : ''}`}>
                            {notification.title}
                            {notification.unread && (
                              <Badge className="ml-2 bg-orange-600 hover:bg-orange-700">
                                Baru
                              </Badge>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 p-6 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-600" />
            Ringkasan Notifikasi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total Notifikasi</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{notifications.filter(n => n.unread).length}</p>
              <p className="text-sm text-gray-600">Belum Dibaca</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{notifications.filter(n => n.type === 'order').length}</p>
              <p className="text-sm text-gray-600">Pesanan</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{notifications.filter(n => n.type === 'point').length}</p>
              <p className="text-sm text-gray-600">Poin</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
