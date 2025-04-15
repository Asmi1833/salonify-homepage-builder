
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
import { Switch } from '@/components/ui/switch';

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
      
      {/* Email preferences section */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">Communication Preferences</h3>
        
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Receive appointment reminders and special offers via email
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="smsNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">SMS Notifications</FormLabel>
                <FormDescription>
                  Receive appointment reminders via text message
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default PreferencesFields;
