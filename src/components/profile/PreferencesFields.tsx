
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PreferencesFieldsProps {
  form: UseFormReturn<any>;
}

const PreferencesFields: React.FC<PreferencesFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St, City, State, ZIP" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="preferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Style Preferences</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your style preferences, allergies, or special requests"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Help us personalize your salon experience
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PreferencesFields;
