'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        router.push('/')
      }
    }
    getCurrentUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  if (user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎使用 MDLOOKER</h1>
            <p className="text-gray-600">登录/注册账号，解锁完整合规服务</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#339999',
                      brandAccent: '#2d8a8a',
                    }
                  }
                }
              }}
              providers={[]}
              redirectTo={`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.mdlooker.com'}`}
              localization={{
                variables: {
                  'en': {
                    sign_in: {
                      email_label: 'Email address',
                      password_label: 'Password',
                      button_label: 'Sign in',
                      link_text: 'Already have an account? Sign in',
                    },
                    sign_up: {
                      email_label: 'Email address',
                      password_label: 'Password',
                      button_label: 'Sign up',
                      link_text: "Don't have an account? Sign up",
                    },
                    forgotten_password: {
                      email_label: 'Email address',
                      button_label: 'Send reset password instructions',
                      link_text: 'Forgot password?',
                    }
                  },
                  'zh': {
                    sign_in: {
                      email_label: '邮箱地址',
                      password_label: '密码',
                      button_label: '登录',
                      link_text: '已有账号？立即登录',
                    },
                    sign_up: {
                      email_label: '邮箱地址',
                      password_label: '密码',
                      button_label: '注册',
                      link_text: '没有账号？立即注册',
                    },
                    forgotten_password: {
                      email_label: '邮箱地址',
                      button_label: '发送密码重置链接',
                      link_text: '忘记密码？',
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
