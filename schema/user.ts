import {z} from 'zod'

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum of 6 characters required."
    }), 
    name: z.string().min(1, {
        message: "Name is Required"
    })
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>


export const LoginSchema = z.object({
    email: z.string().email({
      message: "Email is required"
  }),
  
    password: z.string().min(2,{
      message: "Password is required!"
    })
  })

  export type LoginSchemaType = z.infer<typeof LoginSchema>

  