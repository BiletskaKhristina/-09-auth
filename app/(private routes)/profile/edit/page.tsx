 "use client";


import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";


import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";


import css from "./EditProfile.module.css";


export default function EditProfilePage(){


const router = useRouter();


const {
 user,
 setUser
}=useAuthStore();


const [username,setUsername]=useState(
 user?.username ?? ""
);



if(!user){
 return null;
}



const handleSubmit = async(
e:React.FormEvent
)=>{

e.preventDefault();


const updatedUser = await updateMe({
 username
});


setUser(updatedUser);


router.push("/profile");

};



return (

<main className={css.mainContent}>


<div className={css.profileCard}>


<h1 className={css.formTitle}>
Edit Profile
</h1>


<Image
src={user.avatar}
alt="User Avatar"
width={120}
height={120}
className={css.avatar}
/>



<form
className={css.profileInfo}
onSubmit={handleSubmit}
>


<div className={css.usernameWrapper}>


<label htmlFor="username">
Username:
</label>


<input
id="username"
type="text"
value={username}
onChange={(e)=>setUsername(e.target.value)}
className={css.input}
/>


</div>



<p>
Email: {user.email}
</p>



<div className={css.actions}>


<button
type="submit"
className={css.saveButton}
>
Save
</button>



<button
type="button"
className={css.cancelButton}
onClick={()=>router.push("/profile")}
>
Cancel
</button>


</div>


</form>


</div>


</main>

);

}