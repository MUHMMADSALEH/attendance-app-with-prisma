"use client"
import { registerSchema } from '@/app/lib/validators'
import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'
import { useFetch } from '@/hooks/use-fetch'
import { createUser } from '@/app/actions/user'
import Link from 'next/link'
const Register = () => {
    const router=useRouter()
    const {register,handleSubmit,formState:{errors},setValue}=useForm({
        resolver:zodResolver(registerSchema)
    })
    const {loading,data,error,fn:registerUser}=useFetch(createUser)
    const onSubmit=async(data)=>{
        console.log("data",data)
await registerUser(data)

       
router.push("/login")
    }

   
  return (
    <div className='flex  flex-col justify-center items-center h-screen'>
        <h1 className='text-gray-950 mb-2 text-3xl font-extrabold'>Register Page</h1>
        <form className='flex flex-col gap-3 bg-green-500 border border-gray-950 rounded-xl p-24 ' onSubmit={handleSubmit(onSubmit)} >

    <input id="username" {...register("username")} placeholder='Username....' className='p-2 rounded-lg'/>
    {
        errors?.username && <p className='text-sm text-red-600 mt-1'>{errors?.username?.message}</p>
    }
    <input id="password" {...register("password")} placeholder='Password...' className='p-2 rounded-lg'/>
    {
        errors?.password && <p className='text-sm text-red-600 mt-1'>{errors?.password?.message}</p>
    }
    <input id="email" {...register("email")} placeholder='Email...' className='p-2 rounded-lg'/>
    {
        errors?.email && <p className='text-sm text-red-600 mt-1'>{errors?.email?.message}</p>
    }
    <input id="phoneNumber" {...register("phoneNumber")} placeholder='Phone...' className='p-2 rounded-lg'/>
    {
        errors?.phoneNumber && <p className='text-sm text-red-600 mt-1'>{errors?.phoneNumber?.message}</p>
    }
    <div className='flex justify-between'>
        <Link href="/login">
        <button className='bg-gray-950 text-center p-2 font-bold text-white rounded-lg'>Login</button>
        </Link>
        <button className='bg-gray-950 text-center p-2 font-bold text-white rounded-lg' type='submit' disabled={loading}>{loading?"Registring":"Register"}</button>
        {
        error && <p className='text-sm text-red-600 mt-3'>{error?.message}</p>
    }
    </div>
</form></div>
  )
}

export default Register