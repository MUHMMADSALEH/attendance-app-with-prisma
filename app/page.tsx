"use client";
import { useFetch } from "@/hooks/use-fetch";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { logoutUser, signIn, signOut } from "./actions/user";
import { checkUser } from "@/Lib/checkUser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // For ensuring client-side only
  const date = new Date();
  const router=useRouter()
  // Fetch user from localStorage only when the component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user")) || null;
      setUser(storedUser);
    }
  }, []);
  
  const { data: loggedInUser, fn: fnLoggedInUser } = useFetch(checkUser);
  const { data, fn: fnLoggedOutUser,loading ,error:logOutError} = useFetch(logoutUser);
  // Fetch logged-in user details when the component mounts and user exists
  
  // Determine if the current user has attendance records for the current day
  const currentAttendance =
  loggedInUser?.data?.attendances &&
  loggedInUser.data.attendances.length > 0 &&
  loggedInUser.data.attendances.some((attendance) =>
    new Date(attendance.date).toDateString() === new Date().toDateString()
);

const { fn, data: SignInAndSignOutData, error } = useFetch(
  currentAttendance ?signOut : signIn
);



useEffect(() => {
  if (user?.username) {
    fnLoggedInUser(user.username);
  }
}, [user,SignInAndSignOutData]);

const handleSignIn = async () => {
  console.log("signin");
  await fn(loggedInUser.data.userId);
};

const handleSignOut = async () => {
  console.log("signout");
  await fn(loggedInUser.data.userId);
 

};

const handleLogOut=async()=>{
await fnLoggedOutUser()
router.push("/login")
}
console.log("user ",user)
console.log("loggedInuser ",loggedInUser)
console.log("currentAttendance",currentAttendance)
console.log("userId",loggedInUser?.data?.userId)



  // Prevent rendering anything server-side until the component is mounted
  if (!isMounted) return null;

  return (
    <div className="w-full flex min-h-screen justify-center items-center ">
      <div className="max-w-xl bg-green-400 rounded-lg">
        <div className="p-20 flex flex-col gap-4">
          <h1 className="font-bold">{format(date, "yyyy-MM-dd")}</h1>
          <h1 className="font-bold">{format(date, "hh:mm:ss a")}</h1>
        </div>
        <div className="p-20 flex flex-col gap-4">
          <button
            className="text-md bg-gray-950 font-bold text-white p-2 rounded-lg  disabled:bg-gray-400 disabled:cursor-not-allowed"
  disabled={loggedInUser?.data?.attendances[0]?.signout}
            onClick={currentAttendance ? handleSignOut : handleSignIn}
          >
            {currentAttendance ? "SignOut" : "SignIn"}
          </button>
          {
            error && <p className="text-red-600 text-sm mt-1">{error?.message}</p>
          }
          <Link href={`/viewreport/${loggedInUser?.data?.userId}`}>
          <button className="text-md bg-gray-950 text-white p-2 rounded-lg">
            View Report
          </button>
          </Link>
          {
           logOutError && <p className="text-red-600 text-sm mt-1">{logOutError?.message}</p>
          }
          <button  className="text-md bg-gray-950 text-white p-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading} onClick={handleLogOut}>{logOutError?"Logging Out...":"Logout"}</button>
        </div>
      </div>
    </div>
  );
}
