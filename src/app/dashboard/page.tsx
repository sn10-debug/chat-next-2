/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SVwcZE9ZD9q
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';


export default function Component() {
  const API_KEY=process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const AZURE_KEY=process.env.NEXT_PUBLIC_AZURE_KEY;
  const HUGGING_KEY=process.env.NEXT_PUBLIC_HUGGING_FACE_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY ? API_KEY : "");
  let [selectedFile, setSelectedFile] = useState(null);
  let [readData, setReadData] = useState(null);
  let [summarizeData, setSummarizeData] = useState(null);
  let [textData, setTextData] = useState("The text output will be displayed here...");
  let [fileName, setFileName] = useState("No file selected");


  const handleFileChange = (event:any) => {
    // Get the file from the event target (input element)
    const file = event.target.files[0]; // Assuming you want the first file
    setSelectedFile(file);
    setFileName(file.name);

};

const handleFileUpload = () => {
  // Implement file upload logic here
  console.log('File to upload:', selectedFile);
  // Typically, you would send the file to a server here
};


const translateText = async (text:string) => {
  const key = AZURE_KEY;
  const endpoint = "https://api.cognitive.microsofttranslator.com";
  const location = "southeastasia";

  try {
      const response = await fetch(
          `${endpoint}/translate?api-version=3.0&from=en&to=or`,
          {
              method: 'POST',
              headers: {
                  'Ocp-Apim-Subscription-Key': key,
                  'Ocp-Apim-Subscription-Region': location,
                  'Content-type': 'application/json',
              },
              body: JSON.stringify([{ text: text }])
          }
      );

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result[0]['translations'][0]['text'];
  } catch (error) {
      console.error(`Translation error: ${error}`);
  }
};





// Converts a File object to a GoogleGenerativeAI.Part object.


async function run(mode) {
  // For text-and-images input (multimodal), use the gemini-pro-vision model

  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader?.result?.split(',')[1] );
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }
  

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
let prompt="";
  if (mode==="read")
    prompt="Read the document and extract the text from it";
  else prompt="Summarize the text from the document";

  const fileInputEl = document.getElementById('file-upload') as HTMLInputElement;
  setFileName(selectedFile.name);
  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  
  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  let translatedText = await translateText(text);
  setTextData(translatedText);




  async function query(data:any) {

		const response = await fetch(
			"https://api-inference.huggingface.co/models/facebook/mms-tts-ory",
			{
				headers: { Authorization: `Bearer ${HUGGING_KEY}` },
				method: "POST",
				body: JSON.stringify(data),
			}
		);
			const result = await response.blob();
			return result;
		}
		// query({"inputs": "The answer to the universe is 42"}).then((response) => {
		// 	// Returns a byte object of the Audio wavform. Use it directly  !
		// });

  let audio = await query({"inputs": translatedText}).then((response) => {
    // Returns a byte object of the Audio wavform. Use it directly  !
    return response;
  });

  
  const url = URL.createObjectURL(audio);
  const a = document.createElement("a");
  a.href = url;
  a.download = "audio-file.mp3";
  await a.click();
  URL.revokeObjectURL(url);


  // Copy the audio to the public folder

  

  // let audioElement=document.getElementById("translated-audio") as HTMLAudioElement

  // audioElement.src = url;
  // audioElement.play();




  // Now stream the audio in the browser


  

  // audio = new Audio(url);
  // audio.play();


  


}




  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200 w-full">
      Odia Anuvad Seva      
      </header>
      <main className="grid lg:grid-cols-2 gap-6 items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-lg font-medium text-gray-700 dark:text-gray-300" htmlFor="file-upload">
              Upload File
            </Label>
            <Input onChange={handleFileChange} className="border-gray-300 dark:border-gray-700 w-full" id="file-upload" type="file" />
          <span className="text-gray-700">{fileName}</span>
          </div>
          <div className="flex gap-2 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 border-r-6" onClick={async ()=>{
              await run("read");
            }}>Read</button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={async ()=>{
             await run("summarize");
            }}>Summarize</Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-white dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Text Output</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{textData}</p>
          </div>
          {/* <div className="p-4 border rounded-md bg-white dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Audio Output</h2>
            <audio className="translated-audio mt-2 w-full" id="translated-audio" controls>
              <source src="/" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white">Download Audio</Button>
          </div> */}
        </div>
      </main>
      <footer className="mt-10 text-center text-gray-600 dark:text-gray-400 w-full">
        <p>© 2024 Odia Anuvad Seva . All rights reserved.</p>
      </footer>
    </div>
  )
}