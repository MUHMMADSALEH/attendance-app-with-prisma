import {z} from "zod"

export const registerSchema=z.object({
    username:z.string().min(3,"username is required").max(20).regex(/^[a-zA-Z0-9_]+$/,"Username only can contain letters,numbers  and underscores"),
    password:z.string().min(4,"password is required").max(20),
    email:z.string().email("Invalid Email"),
    phoneNumber: z.string()
    

})

export const loginSchema=z.object({
    username:z.string().min(3,"username is required").max(20).regex(/^[a-zA-Z0-9_]+$/,"Username only can contain letters,numbers  and underscores"),
    password:z.string().min(4,"password is required").max(20),
})