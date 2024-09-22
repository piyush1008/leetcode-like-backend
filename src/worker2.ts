import { createClient } from "redis";

const client =createClient();

async function startWorker(){
    try {
        await client.connect();

        await client.subscribe("problems_done",(message)=>{
            console.log("message received ->", message)
        })
         
    } catch (error) {
        console.log(error)
    }
}





startWorker();