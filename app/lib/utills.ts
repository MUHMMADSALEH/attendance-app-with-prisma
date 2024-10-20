import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

export const JWT_SECRET="mysecret"


export const hashPassword=async(password)=>{
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt)
    return hashedPassword
}

export const verifyPassword=async(password,hashedPassword)=>{
    const verifiedPassword= await bcrypt.compare(password,hashedPassword)
    if(verifiedPassword){
        return true
    }

    return false
}

export const SignToken=async(username)=>{
    const token= await jwt.sign({username},JWT_SECRET)
    return token

}

export const verifyToken=async(token)=>{
const decoded = await jwt.verify(token,JWT_SECRET)
if(decoded){
    return 
}
else{
    throw new Error("unauthorized")
}
    

}