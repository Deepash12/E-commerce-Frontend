import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addressAPI } from './../../api/services';
import type { Address, AddressRequest } from './../../types';
import { Field } from './../../components/ui';
import toast from 'react-hot-toast';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Must be 10 digits starting with 6-9').required('Phone required'),
  addressLine1: yup.string().required('Address line is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postalCode: yup.string().matches(/^\d{6}$/, 'Must be exactly 6 digits').required('Postal code required'),
  country: yup.string().required('Country is required'),
  landmark: yup.string(),
  isDefault: yup.boolean().required(),
}).required();

interface Props {
  initialData?: Address | null
  onSuccess: () => void
  onCancel: () => void
}

const AddressForm: FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressRequest>({
    resolver: yupResolver(schema) as never,
    defaultValues: initialData ??{ country: 'India', isDefault: false },
  });

  const onSubmit = async (data: AddressRequest) => {
    try {
      if (initialData) {
  await addressAPI.update(initialData.id, data);
  toast.success('Address updated');
} else {
  await addressAPI.add(data);
  toast.success('Address saved');
}
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to save address');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Full Name" error={errors.fullName?.message} required>
            <input className="input" placeholder="John Doe" {...register('fullName')} />
          </Field>
        </div>
        <Field label="Phone" error={errors.phone?.message} required>
          <input className="input" placeholder="9876543210" {...register('phone')} />
        </Field>
        <Field label="Postal Code" error={errors.postalCode?.message} required>
          <input className="input" placeholder="6-digit code" {...register('postalCode')} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address Line 1" error={errors.addressLine1?.message} required>
            <input className="input" placeholder="Street, Building, Area" {...register('addressLine1')} />
          </Field>
        </div>
        <Field label="Landmark" error={errors.landmark?.message}>
          <input className="input" placeholder="Near..." {...register('landmark')} />
        </Field>
        <Field label="City" error={errors.city?.message} required>
          <input className="input" placeholder="Mumbai" {...register('city')} />
        </Field>
        <Field label="State" error={errors.state?.message} required>
          <input className="input" placeholder="Maharashtra" {...register('state')} />
        </Field>
        <Field label="Country" error={errors.country?.message} required>
          <input className="input" placeholder="India" {...register('country')} />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-obsidian-400">
        <input type="checkbox" className="accent-gold-400 w-4 h-4" {...register('isDefault')} />
        Set as default address
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Address' : 'Save Address')}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
