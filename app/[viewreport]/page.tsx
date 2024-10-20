import React, { useEffect, useState } from 'react'
import { getAllUser } from '../actions/user'
import Link from 'next/link'

const ViewReport = async() => {
  
const users=await getAllUser()

  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
      <h1 className='text-2xl font-extrabold text-gray-950 mb-6'> Users</h1>
      <ul className='flex flex-col bg-green-700 p-10 gap-5  rounded-xl outline outline-gray-950/10 shadow-md shadow-emerald-200'>
      {
      users && users.length>0?users.map((user)=>(
       <>
        <li key={user?.id} className='text-2xl'>
<Link href={`/viewreport/${user.id}?username=${user.username}`}>
<h1>{user.username}</h1>
</Link>
        </li>
        <hr  className='text-gray-950'/></>
      )):<p>No user Found</p>
      }
</ul>
    </div>
  )
}

export default ViewReport