"use client";
import { signIn, signOut,useSession } from "next-auth/react";

export function Appbar(){
    const session = useSession();
    return <div>
        <div className="flex justify-center">
            <div>
                Muzi
            </div>
            <div>
                {session.data?.user && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3
                px-4 rounded" onClick={()=>signOut()} >Logout </button>  
                }

                {!session.data?.user && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3
                px-4 rounded" onClick={()=>signIn()}>Login</button>}
            </div>
        </div>
    
    
    </div>
}