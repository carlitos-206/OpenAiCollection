// Hides the API KEY -- DO NOT REMOVE
import * as dotenv from 'dotenv';
dotenv.config();
// The API KEY STORED IN A VARIABLE TO BE ACCESS GLOBALLY s
const api_key = process.env.AI_KEY

// OPEN AI API imports
import { Configuration, OpenAIApi } from 'openai';

// Other NPM imports
import { writeFileSync } from 'fs';
import inquirer from 'inquirer';
import util from 'util';

// Authenticate your call with a new configuration of the api by passing the api key
const configuration = new Configuration({
  apiKey: api_key,

})
// API SDK Function call
const openAI =  new OpenAIApi(configuration);



// API CALL
const apiCall = async (prompt) =>{
  // the call
  const result = await openAI.createImage({
    // The AI prompt to draw
    prompt,
    // number of imgs to draw
    n:1,
    // img size
    size: "1024x1024",
    // user
    // user: "carlitos"
  })

  // turn it into a url
  let url = result.data.data[0].url
  console.log(`
  url: ${url},
  ALL:
  `, util.inspect(result, {showHidden: false, depth: null, colors: true}))

  
  // Download IMG to Hard Disk
  const imgResult = await fetch(url);
  const blob = await imgResult.blob()
  const buffer = Buffer.from( await blob.arrayBuffer() )
  writeFileSync(`./img/${Date.now()}.png`, buffer)

  return main_app(1)
}




// Recursive Function to keep terminal running 
const main_app = async (val) =>{
  // When the app first starts
  if(val===0){
    let question = {
      type: 'input',
      name: 'welcome page',
      message: 'Welcome my child, what would you like to see?    :)  '
    }
    return setTimeout(() =>{
      inquirer.prompt(question).then(
        answer => {
          return apiCall(answer['welcome page'])
        }
      )
    })
  }else{
    let question = {
      type: 'input',
      name: 'welcome page',
      message: `
      :) what else can i show you? 
      or are you afraid to continue?
      `
    }
    return setTimeout(() =>{
      inquirer.prompt(question).then(
        answer => {
          return apiCall(answer['welcome page'])
        }
      )
    })
  }
}



// Start the app
main_app(0)