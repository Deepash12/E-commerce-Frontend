import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Field } from '../components/ui';
import toast from 'react-hot-toast';
import type { LoginRequest } from '@/types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res: any = await login(data);

      toast.success('Welcome back!');

      // ✅ Admin aur User ke liye alag redirect
      if (res?.role === 'ROLE_ADMIN') {
        navigate('/admin/products', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }

    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-obsidian-950">
      <div className="w-full max-w-[400px] animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-medium text-gradient tracking-widest mb-2">LUXE</h1>
          <p className="font-display text-2xl font-medium text-obsidian-200">Welcome Back</p>
          <p className="text-obsidian-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="card border-obsidian-700 p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <Field label="Email" error={errors.email?.message} required>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
                })}
              />
            </Field>

            <Field label="Password" error={errors.password?.message} required>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  {...register('password', { required: 'Password is required' })}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-obsidian-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>

              </div>
            </Field>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-obsidian-500 hover:text-gold-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div className="divider" />

          <p className="text-center text-obsidian-500 text-sm">
            New to LUXE?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors">
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;