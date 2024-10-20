"use server"

import { db } from "./prisma"

export const checkUser=async(username)=>{
const currentDate=new Date()

const startOfDay=new Date(currentDate.setHours(0,0,0,0))
const endOfDay=new Date(currentDate.setHours(23,59,59,999))



    const existingUser=await db.user.findUnique({
        where:{
            username:username
        }
    })
    if(!existingUser){
        throw new Error("user not found")
    }

    const loggedInUser=await db.user.findFirst({
        where:{
            username:username
        },
        include:{
            attendances:{
                where:{
                    date:{
                        gte:startOfDay,
                        lte:endOfDay
                    }
                },
                select:
                {
                    signin: true,
                    signout: true,
                    status: true,
                    date: true
                }
            }

        }
    })

    if(!loggedInUser){
        return null
    }

    const {id,attendances}=loggedInUser

    return {success:true,data:{userId:id,attendances:attendances}}
}