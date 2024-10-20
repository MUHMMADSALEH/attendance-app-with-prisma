"use server"
import { db } from "@/Lib/prisma"
import { hashPassword, SignToken, verifyPassword } from "../lib/utills"
import { cookies } from "next/headers"
import { format } from "date-fns"



export const createUser = async (data) => {


    const existingUser = await db.user.findUnique({
        where: {
            username: data.username
        }
    })
    if (existingUser) {
        throw Error("Username Already taken")
    }

    const hashedPassword = await hashPassword(data.password)
    console.log("password", hashedPassword)

    await db.user.create({
        data: {
            username: data.username,
            password: hashedPassword,
            email: data.email,
            phoneNumber: data.phoneNumber

        }
    })

    return {
        success: true
    }



}

export const loginUser = async (data) => {
    const currentDate = new Date();
    if (data.username === "admin" && data.password === "password") {
        const user = await db.user.findUnique({
            where: {
                username: data.username

            },


        })

        if (!user) {
            throw new Error("User is not found")
        }

        const password = await verifyPassword(data.password, user.password)


        if (!password) {
            throw new Error("Password is not correct")
        }

        const token = await SignToken(data.username)
        const cookieStore = cookies()
        cookieStore.set("token", token, { httpOnly: true })
        return
    }
    else {


        // Set the time to 00:00:00 to only compare the date part
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

        const user = await db.user.findUnique({
            where: {
                username: data.username

            },
            include: {
                attendances: {
                    where: {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
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

        if (!user) {
            throw new Error("User is not found")
        }

        const password = await verifyPassword(data.password, user.password)


        if (!password) {
            throw new Error("Password is not correct")
        }

        const token = await SignToken(data.username)
        const cookieStore = cookies()
        cookieStore.set("token", token, { httpOnly: true })

        return {
            success: true,
            user: {
                userId: user.id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                attendances: user.attendances.length !== 0 ? user.attendances : null
            }
        }

    }
}

export const logoutUser = () => {
    const cookieStore = cookies()
    cookieStore.set("token", "", { httpOnly: true })
    return
}

export const signIn = async (userId) => {
    console.log("userId from server", userId)
    // console.log("user on server side",user)
    const currentDate = new Date();

    // Set the time to 00:00:00 to only compare the date part
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const existingAttendance = await db.attendance.findFirst({
        where: {
            userId: userId,
            date: {
                gte: startOfDay,  // Greater than or equal to the start of today
                lte: endOfDay,    // Less than or equal to the end of today
            },
        },
    });
    //   console.log("existinatt",existingAttendance)
    if (!existingAttendance) {
        await db.attendance.create({
            data: {
                userId: userId,
                date: new Date(),
                signin: new Date(),
                signout: null,
                status: "PRESENT"
            }
        })
    }

    else {

        throw new Error("Already signIn")
    }
    return {
        success: true,
        data: {
            userId: userId,
            date: new Date(),
            signin: new Date(),
            signout: null,
            status: "PRESENT"
        }
    }
}







export const signOut = async (userId) => {
    console.log("userId from server", userId)
    // console.log("user on server side",user)
    const currentDate = new Date();

    // Set the time to 00:00:00 to only compare the date part
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const existingAttendance = await db.attendance.findFirst({
        where: {
            userId: userId,
            date: {
                gte: startOfDay,  // Greater than or equal to the start of today
                lte: endOfDay,    // Less than or equal to the end of today
            },
            signout: null


        },
    });
    console.log("existinatt", existingAttendance)
    if (existingAttendance) {
        await db.attendance.update({
            where: {
                id: existingAttendance.id,
                userId: userId,

            },
            data: {

                signout: new Date(),

            }
        })
    }

    else {

        throw new Error("Already signout")
    }
    return {
        success: true,

    }

}

export const getAttendance = async (userId) => {
    console.log("userId  :", userId)

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new Error("user not found")
    }
    const attendances = await db.attendance.findMany({
        where: {
            userId: userId
        },

        select: {
            signin: true,
            signout: true,
            date: true,
            status: true


        }

    })

    console.log("attendance in server",attendances)

    return{
        username:user.username,
        attendances:attendances
    }


}

export const getAllUser = async () => {

    try {
        const users = await db.user.findMany({

        }); // Fetch all users

        const nonAdmin = users.filter((user) => user.username !== "admin")
        return nonAdmin;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}