"use client";


import { useEffect } from "react";
import { checkSession,getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";


export default function AuthProvider({
children
}:{
children:React.ReactNode
}){


const {
 setUser,
 clearIsAuthenticated
}=useAuthStore();



useEffect(()=>{

 const verify=async()=>{

 try{

 await checkSession();

 const user=await getMe();

 setUser(user);

 }
 catch{

 clearIsAuthenticated();

 }

 };


 verify();


},[setUser,clearIsAuthenticated]);



return children;

}