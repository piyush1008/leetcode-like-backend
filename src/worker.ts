import { createClient } from "redis";

const client=createClient();

async function processSubmission(submission:string)
{
    const {problemId,code,language}=JSON.parse(submission);
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);

    await new Promise(resolve => setTimeout(resolve,1000));
    console.log(`Finsihed proceesing submission for problemid ${problemId}`)
    client.publish("problems_done", JSON.stringify({problemId, status:"TLE"}))
}

async function startWorker(){
    try {
        await client.connect();
        console.log("worker connnected to redis");

        while(true)
        {
            try {
                const submission=await client.brPop("problems",0);
                console.log("submission element", submission)
                if(submission && submission.element)
                {
                    await processSubmission(submission?.element)
                }
               

            } catch (error) {
                console.error("error procession subsmisstion", error);
            }
        }
    } catch (error) {
        console.log(error)
    }
}


startWorker();