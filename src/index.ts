import express from "express";

import { createClient } from "redis";

const app=express();
app.use(express.json());

const client=createClient();
client.on("error",(err)=> console.log(`redis client error ${err}`))

app.post("/submit",async(req,res)=>{
    const problemId=req.body.problemId;
    const code=req.body.code;
    const language=req.body.language;

    try {
        await client.lPush("problems",JSON.stringify({
            code,
            language,
            problemId
        }))

        res.status(200).send("submission received and stored")
    } catch (error) {
        console.log("error in post ", error)
    }
})



async function startServer(){
    try {
        await client.connect();
        app.listen(3000,()=>{
            console.log(`Server is runnig on port 3000`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();