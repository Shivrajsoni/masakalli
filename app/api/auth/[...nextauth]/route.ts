
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { prismaClient } from "@/app/lib/db";

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID || '',
            clientSecret:process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        GithubProvider({
            clientId:process.env.GITHUB_CLIENT_ID || '',
            clientSecret:process.env.GITHUB_CLIENT_SECRET || ''
        })

    ],
    callbacks:{
        async signIn(params){
            console.log(params);
            
            try{
                await prismaClient.user.create({
                    email:params.user.email,
                    provider:params.account?.provider
                })

            }catch(error){
                console.error(error);
            }

            return true
        }
    }


})

export { handler as GET , handler as POST}