/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prismaClient } from "@/app/lib/db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import youtubesearchapi from "youtube-search-api";



const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;



const creatorStreamSchema = z.object({
    creatorId:z.string(),
    url:z.string()
})

export  async function POST(req:NextRequest){

    try {
        const data = creatorStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        if(!isYt){
           return NextResponse.json({
            error:"Invalid URL"
           },{ 
            status:400
           })
        }

        const extractedId = data.url.split("?v=")[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a:{width:number},b:{width:number})=>a.width<b.width ?-1:1)

        console.log(res.title);

      const stream = await prismaClient.stream.create({
            data:{
                userId:data.creatorId,
                type:"Youtube",
                url:data.url,
                extractedId:extractedId,
                // title: res.title ?? "Dont see the Title",
                smallImg:(thumbnails.length>1 ?  thumbnails[thumbnails.length -2 ].url : thumbnails[thumbnails.length -1].url) ?? "https://plus.unsplash.com/premium_photo-1667030474693-6d0632f97029?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0fGVufDB8fDB8fHww",
                bigImg:thumbnails[thumbnails.length -1].url ?? "https://plus.unsplash.com/premium_photo-1667030474693-6d0632f97029?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0fGVufDB8fDB8fHww"
            }
        })
        return NextResponse.json({
            message:"Stream created successfully",
            id:stream.id
        },
    {status:200
    })
        
    } catch (e) {
        console.log(e);
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