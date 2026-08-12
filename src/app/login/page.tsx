'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2940')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]"></div>
        {/* Decorative gold lines */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#E6D5B8]/10 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-[#E6D5B8]/5 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-serif font-bold tracking-wider">
              <span className="text-white">Hidayat</span>{' '}
              <span className="text-[#E6D5B8]">Garage</span>
            </span>
          </Link>
          <div className="w-16 h-[1px] bg-[#E6D5B8]/50 mx-auto mb-4"></div>
          <p className="text-neutral-500 text-sm uppercase tracking-[0.3em]">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl font-serif text-white mb-1">Selamat Datang</h2>
          <p className="text-neutral-500 text-sm mb-8">Masuk untuk mengelola armada Anda</p>

          <form className="space-y-5" action={dispatch}>
            <div>
              <label htmlFor="username" className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username"
                  className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.3)] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-neutral-600 focus:outline-none focus:border-[#E6D5B8] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.3)] transition-all text-sm"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-950/50 border border-red-900/50 rounded-xl px-4 py-3 flex items-center gap-3 animate-scaleIn">
                <span className="text-red-400 text-lg">⚠</span>
                <span className="text-red-400 text-sm">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#E6D5B8] text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
            <Link href="/" className="text-neutral-500 text-sm hover:text-[#E6D5B8] transition-colors inline-flex items-center gap-2">
              <span>←</span> Kembali ke website
            </Link>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-neutral-700 text-xs">© {new Date().getFullYear()} Hidayat Garage. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
