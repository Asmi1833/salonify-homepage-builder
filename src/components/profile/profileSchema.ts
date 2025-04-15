
import * as z from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  birthday: z.date().optional(),
  address: z.string().optional(),
  preferences: z.string().optional(),
  profileImage: z.string().optional(),
  likedServices: z.array(z.string()).optional(),
  paymentMethods: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      last4: z.string().optional(),
      expiryDate: z.string().optional(),
      isDefault: z.boolean().optional(),
    })
  ).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const staffProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  profileImage: z.string().optional(),
  role: z.string(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(
    z.object({
      day: z.string(),
      slots: z.array(
        z.object({
          start: z.string(),
          end: z.string(),
        })
      ),
    })
  ).optional(),
});

export type StaffProfileValues = z.infer<typeof staffProfileSchema>;
