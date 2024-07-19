'use client'
import React, { useCallback } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { LoginSchema, LoginSchemaType } from '@/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { LoginAccount } from '../_actions/login';
import { toast } from 'sonner';
import CardWrapper from '../_components/card-wrapper';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const router = useRouter()
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: LoginAccount,
        onSuccess: (data) => {
            if(data?.success){
                toast.success(data.success)
                router.push('/dashboard')
            }

            if(data?.error){
                toast.error(data.error)
            }
        },
        onError: () => {
            toast.error("An unexpected error occurred.");
        }
    });

    const onSubmit = useCallback((values: LoginSchemaType) => {
        mutate(values);
    }, [mutate]);

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/register"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            placeholder="JohnDoe"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" size="lg">
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default LoginForm;
