import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '@/api/services';
import { useAuth } from '@/context/AuthContext';
import { Field } from '@/components/ui';
import toast from 'react-hot-toast';
import type { RegisterRequest } from '@/types';

const schema = yup.object({
  username: yup.string().min(3, 'Min 3 characters').required('Username required'),
  email: yup.string().email('Invalid email format').required('Email required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password required'),
  phoneNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Must be 10 digits starting with 6, 7, 8 or 9')
    .required('Phone number required'),
}).required();

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>({
    resolver: yupResolver(schema) as never,
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await authAPI.register(data);
      toast.success('Account created! Signing in...');
      await login({ email: data.email, password: data.password });
      navigate('/products');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-obsidian-950">
      <div className="w-full max-w-[420px] animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-medium text-gradient tracking-widest mb-2">LUXE</h1>
          <p className="font-display text-2xl font-medium text-obsidian-200">Create Account</p>
          <p className="text-obsidian-500 text-sm mt-2">Join for exclusive access</p>
        </div>

        <div className="card border-obsidian-700 p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Username" error={errors.username?.message} required>
              <input className="input" placeholder="Your display name" {...register('username')} />
            </Field>
            <Field label="Email" error={errors.email?.message} required>
              <input className="input" type="email" placeholder="you@example.com" {...register('email')} />
            </Field>
            <Field label="Phone Number" error={errors.phoneNumber?.message} required>
              <input className="input" placeholder="10-digit number (starts 6-9)" {...register('phoneNumber')} />
            </Field>
            <Field label="Password" error={errors.password?.message} required>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  {...register('password')}
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

            <button type="submit" className="btn btn-primary w-full py-3 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider" />
          <p className="text-center text-obsidian-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
