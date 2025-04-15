
import * as z from 'zod';

export const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  birthday: z.date().optional(),
  address: z.string().optional(),
  preferences: z.string().optional(),
  profileImage: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
