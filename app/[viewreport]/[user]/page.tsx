import { getAttendance } from '@/app/actions/user'
import React from 'react'
import Card from './_component/Card'


const UserReport = async ({ params }) => {
    const { user } = params

   

    // console.log("userId  ",user)
    // console.log("params ",params)
    const{ attendances,username} = await getAttendance(user)
    // console.log("attendance", attendances)
    return (
        <div className=" flex flex-col justify-center items-center min-h-screen gap-5 ">
           

           
           <h1 className='text-2xl text-gray-950 font-medium mb-5 '>{username.toUpperCase()} Attendance Page</h1>
            {
                attendances&& attendances.length > 0 ? attendances.map((attendance)=>
                <Card key={attendance.date} signin={attendance.signin} signout={attendance.signout} date={attendance.date} status={attendance.status}/>) : null
    
       }
     
        </div>

    
  )
}

export default UserReport