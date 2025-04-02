
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [resetSent, setResetSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await resetPassword(data.email);
      setResetSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4">
        <motion.div 
          className="w-full bg-background p-8 rounded-xl shadow-lg border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
            <h1 className="text-2xl font-bold text-center flex-1">Reset Password</h1>
          </div>
          
          {resetSent ? (
            <Alert>
              <AlertDescription>
                If an account exists with that email, we've sent password reset instructions to your inbox.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="you@example.com" type="email" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                </form>
              </Form>
            </>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
