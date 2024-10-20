import { format } from 'date-fns'
import React from 'react'

const Card = ({date,signin,signout,status}) => {
  return (
    <div className='bg-green-600 shadow-md rounded-xl border-gray-950/5 p-10'>
<div className='flex flex-col gap-4'>

<p className='text-gray-950 font-extrabold'>{format(date,'yyyy-MM-dd')}</p>
<p className='text-gray-950 font-bold'>SignIn: {status==="PRESENT"?format(signin,'hh:mm:ss a'):"ABSENT"}</p>
<p className='text-gray-950 font-bold'>SignOut: {status==="PRESENT"?format(signout,'hh:mm:ss a'):"ABSENT"}</p>
<br/>

</div>
     
    </div>
  )
}

export default Card