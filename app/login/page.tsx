'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to manage your articles' 
                  : 'Join Moi l\'aigle to start writing'}
              </p>
            </div>

            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  isLogin
                    ? 'bg-white text-primary-700 font-semibold shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  !isLogin
                    ? 'bg-white text-primary-700 font-semibold shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Register
              </button>
            </div>

            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

