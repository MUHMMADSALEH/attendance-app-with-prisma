"use client"
import { loginSchema } from '@/app/lib/validators'
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from 'next/link'
import { useFetch } from '@/hooks/use-fetch'
import { loginUser } from '@/app/actions/user'
import { useRouter } from 'next/navigation'
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) }
    )
    const router = useRouter()
    const { loading, data: fetchedData, error, fn: fnLogin } = useFetch(loginUser)
    useEffect(() => {
        if (fetchedData?.user) {
            localStorage.setItem("user", JSON.stringify(fetchedData.user));
        }
    }, [fetchedData]);

    const onSubmit = async (data) => {
        if (data.username === "admin" && data.password === "admin") {
            console.log("Admin login detected, redirecting...");
            await fnLogin(data)
        
                router.push("/viewreport");
         
        }

      else{
        await fnLogin(data)

        router.push("/")
      }





    }
    console.log("error", error)
    console.log("data", fetchedData)
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-3xl font-extrabold'>Login Page</h1>
            <form className='flex flex-col gap-10 bg-green-500 border border-gray-950 rounded-lg p-24  mt-4' onSubmit={handleSubmit(onSubmit)}>

                <input id="username" {...register("username")} placeholder='Username....' className='p-2 rounded-lg' />
                {
                    errors?.username && <p className='text-sm text-red-500 mt-1'>{errors?.username?.message}</p>
                }
                <input id="password" {...register("password")} placeholder='Password...' className='p-2 rounded-lg' />
                {
                    errors?.password && <p className='text-sm text-red-500 mt-1'>{errors?.password?.message}</p>
                }
                {
                    error && <p className='text-sm text-red-500 mt-2'>{error?.message}</p>
                }
                <div className='flex justify-between '>
                    <button className='bg-gray-950 text-center p-2 font-bold text-white rounded-lg' type='submit' disabled={loading}>{loading ? "logging..." : "Login"}</button>

                    <Link href="/register">
                        <button className='bg-gray-950 text-center p-2 font-bold text-white rounded-lg'>Register</button>

                    </Link>

                </div>
            </form>


        </div>

    )
}

export default Login