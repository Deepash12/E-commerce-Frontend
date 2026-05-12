import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../api/service';
import { Field } from '../components/ui';
import toast from 'react-hot-toast';



export const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] flex items-center justify-center">
      <div className="w-full max-w-[400px] animate-fade-up">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs text-obsidian-500 hover:text-obsidian-300 mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        {sent ? (
          <div className="card border-obsidian-700 p-10 text-center">
            <CheckCircle size={48} className="text-gold-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-medium mb-3">Check Your Email</h2>
            <p className="text-obsidian-500 text-sm mb-6">
              We've sent a password reset link to your email address.
            </p>
            <Link to="/login" className="btn btn-outline w-full justify-center">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <div className="card border-obsidian-700 p-7">
            <h1 className="font-display text-2xl font-medium mb-1">Reset Password</h1>
            <p className="text-obsidian-500 text-sm mb-6">Enter your email to receive a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field label="Email Address" error={errors.email?.message} required>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email required',
                    pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
                  })}
                />
              </Field>
              <button type="submit" className="btn btn-primary w-full py-3" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>();

  const onSubmit = async ({ newPassword }: { newPassword: string; confirmPassword: string }) => {
    try {
      await authAPI.resetPassword({ newPassword, token });
      toast.success('Password reset! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-[400px] animate-fade-up">
        <div className="card border-obsidian-700 p-7">
          <h1 className="font-display text-2xl font-medium mb-1">New Password</h1>
          <p className="text-obsidian-500 text-sm mb-6">Choose a strong new password.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="New Password" error={errors.newPassword?.message} required>
              <input
                className="input"
                type="password"
                placeholder="Min 6 characters"
                {...register('newPassword', {
                  required: 'Required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
            </Field>
            <Field label="Confirm Password" error={errors.confirmPassword?.message} required>
              <input
                className="input"
                type="password"
                placeholder="Confirm new password"
                {...register('confirmPassword', {
                  validate: (v) => v === watch('newPassword') || 'Passwords do not match',
                })}
              />
            </Field>
            <button type="submit" className="btn btn-primary w-full py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
