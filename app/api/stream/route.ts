/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prismaClient } from "@/app/lib/db";

const YT_REGEX = new RegExp("^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$")  


const creatorStreamSchema = z.object({
    creatorId:z.string(),
    url:z.string()
})

export  async function POST(req:NextRequest){

    try {
        const data = creatorStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if(!isYt){
           return NextResponse.json({
            error:"Invalid URL"
           },{ 
            status:400
           })
        }

        const extractedId = data.url.split("?v=")[1];


       await prismaClient.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                extractedId:extractedId,
                type:"Youtube"
            }
        })
        
    } catch (e) {
       return NextResponse.json({
        message:"Error While Connecting a Stream"
       },{
        status:400
       })
        
    }

    

}

export  async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.user.findMany({
        where:{
            id:creatorId ??""
        }
    })
    return NextResponse.json({
        streams:streams
    })
}