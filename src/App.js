
import "./App.css"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import {useState} from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const App = () => {
      const [question, setQuestion] = useState("");
      const [answer, setAnswer] = useState("");
      const [voice,setVoice] = useState(true);
      const [record,setRecord] = useState(true);
      const [render,setRender] = useState(true);
      const [generatingAnswer, setGeneratingAnswer] = useState(false);
    const [textToCopy, setTextToCopy] = useState();
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration:1000
    });
    //subscribe to thapa technical for more awesome videos
    const startListening = () => {setRecord(false); SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })};
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }
    async function generateAnswer(e) {
    setGeneratingAnswer(true);
    setRender(false)
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take upto 10 seconds");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
         "AIzaSyC3Nhc1jwp7Uytky5zfqVrZABZ9bbQ2Vzw"
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  const textToSpeech = (text) => {
    setVoice(false);
    const value = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(value);
  }
  const stop = () => {
      
      window.speechSynthesis.cancel();
      setVoice(true);
  }

const stopListening = () => {setRecord(true) ; SpeechRecognition.stopListening();setQuestion(transcript)}
console.log(answer)
    return (
        <>
            <div className="container">
                <div className="min-w-full h-6 bg-black"></div>

                <h2 className="">Speech to Text Converter</h2>
                <br/>
                <p>A React hook that converts speech from the microphone to text and makes it available to your React
                    components.
                    </p>

                <div className="main-content overflow-y" onClick={() =>  setQuestion(transcript)}>
                    {render ? transcript : answer}
                </div>
                <div className="btn-style">
                    <button onClick={record ? startListening : stopListening}>{record? "Start Listening" :"Stop Listening"}</button>
                    {/* <button onClick={SpeechRecognition.stopListening }>Stop Listening</button> */}
                    <button onClick={generateAnswer }>Generate Answer</button>
                    <button  onClick={()=> voice ? textToSpeech(answer) :  stop(answer)}>{voice ? <FaPlay/>:<FaPause/>}</button>
                </div>
            </div>
        </>
    );
};

export default App;