import { useState,useEffect} from "react"

export const useFetch=(cb)=>{
    const [data,setdata]=useState(undefined)
    const [loading,setLoading]=useState(null)
    const [error,setError]=useState(null)
    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => setError(null), 2000); // 2 seconds delay
          return () => clearTimeout(timer); // Cleanup to prevent memory leaks
        }
      }, [error]);

const fn=async(...args)=>{
    setLoading(true)
    setError(null)
    try {
        const response=await cb(...args)
        setdata(response)
        setError(null)
    } catch (error) {
        setError(error)
    }finally{
        setLoading(false)
    }

}
return {
    data,loading,error,fn
}

}