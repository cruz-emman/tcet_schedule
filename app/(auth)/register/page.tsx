'use client'

import React, { useCallback } from 'react'
import CardWrapper from '../_components/card-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { RegisterSchema, RegisterSchemaType } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { RegisterAccount } from '../_actions/register'
import { toast } from 'sonner'

const RegisterForm = () => {

    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            name: '',
            password: ''
        }
    })


    const {mutate, isPending} = useMutation({
        mutationFn: RegisterAccount,
        onSuccess: () => {
            toast.success("User successuffly registered 🎊", {
                id: 'created-user'
            })
        },
        onError: (err) => {
          console.log(err)
          toast.error(err.message);
      }
    })

    const onSubmit = useCallback((values: RegisterSchemaType) => {
        mutate(values)
    },[mutate])


  return (
    <CardWrapper
    headerLabel="Create an account"
    backButtonLabel="Already have an account?"
    backButtonHref="/login"
  >
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-6">
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
                    placeholder="email@gmail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
          <Button
            //disabled={isPending}
            type="submit"
            className="w-full"
            size="lg"
          >
            Create an account
          </Button>
        </div>
       
      </form>
    </Form>
  </CardWrapper>
  )
}

export default RegisterForm