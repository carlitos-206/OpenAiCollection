// Hides the API KEY -- DO NOT REMOVE
import * as dotenv from 'dotenv';
dotenv.config();

// The API KEY STORED IN A VARIABLE TO BE ACCESS GLOBALLY s
const api_key = process.env.AI_KEY

// OPEN AI API imports
import { Configuration, OpenAIApi } from 'openai';

// Other NPM imports
import { createReadStream, writeFileSync, existsSync } from 'fs';
import inquirer from 'inquirer';
import util from 'util';

// Authenticate your call with a new configuration of the api by passing the api key
const configuration = new Configuration({
  apiKey: api_key,
})

// API SDK Function call
const openAI =  new OpenAIApi(configuration);

// API CALL
const apiCall = async () =>{
  // img file name
  const path= './images/image_name.png'
  // the call
  try{
    if(existsSync(path)){
      const result = await openAI.createImageVariation(
        createReadStream(path), //img location
        1, //Quantity
        "1024x1024" //Img size --- see openAI docs for size info
      )
    
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
      writeFileSync(`./images/result/${Date.now()}.png`, buffer)
      return main_app(1)
    }else{
      return main_app("error")
    }
  }catch(error){
    console.log(error)
    return main_app("error")
  }
}

// Recursive Function to keep terminal running 
const main_app = async (val) =>{
  // API call returns an error
  if(val === "error"){
    let question = {
      type: 'input',
      name: 'AI Initial Question',
      message: `
      There has been a error in the code.

      Refer to the console for details.

      Fixed(Yes/No):
      `
    }
    return setTimeout(() =>{
      inquirer.prompt(question).then(
        (answer) => {
          if(answer['AI Initial Question'].toLowerCase() === "yes" || answer['AI Initial Question'].toLowerCase() === "yes "){
            return apiCall()
          } else{
            console.log('1')
            return false
          }
          //return apiCall(answer['welcome page'])
        }
      )
    })
  }
  // When the app first starts
  else if(val === 0){
    let question = {
      type: 'input',
      name: 'AI Initial Question',
      message: 'Have you set a proper image?'
    }
    return setTimeout(() =>{
      inquirer.prompt(question).then(
        (answer) => {
          if(answer['AI Initial Question'].toLowerCase() === "yes" || answer['AI Initial Question'].toLowerCase() === "yes "){
            return apiCall()
          } else{
            console.log('1')
            return false
          }
          //return apiCall(answer['welcome page'])
        }
      )
    })
  }else{
    let question = {
      type: 'input',
      name: 'AI Recursive Question',
      message: 'Did you ensure the right image has been set?'
    }
    return setTimeout(() =>{
      inquirer.prompt(question).then(
        (answer) => {
          if(answer['AI Initial Question'].toLowerCase() === "yes" || answer['AI Initial Question'].toLowerCase() === "yes "){
            return apiCall()
          }else{
            console.log('1')
            return false
          }
          //return apiCall(answer['welcome page'])
        }
      )
    })
  }
}

// Start the app
main_app(0)