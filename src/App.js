import { useState } from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [response, setResponse] = useState(""); // Added state to store API response
  const surpriseOptions = [
    "Who won the 2023 World Cup?",
    "When is the next solar eclipse?",
    "What is the capital of France?",
    "How many moons does Jupiter have?",
    "What is the population of the United States?",
    "What is the tallest mountain in the world?",
    "What is the largest ocean in the world?"
  ];

  const surprise = () => {
    const randomValue = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[randomValue]);
    getResponse(surpriseOptions[randomValue]); // Call getResponse with the random question
  };

  const getResponse = async (question = value) => {
    if (!question) {
      setError("Please, ask a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: question,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        {
          role: "user",
          content: question // Changed 'parts' to 'content'
        },
        {
          role: "model",
          content: data // Changed 'parts' to 'content'
        }
      ]);
      setResponse(data); // Update the response state with the new data
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  }; // Function to clear the error

  return (
    <div className="app">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center my-4">Ask Gemini</h1>
      <p>
        What do you want to know?
        <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" onClick={surprise} disabled={!chatHistory.length==0}>
          Surprise Me
        </button>
      </p>
      <div className="input-container my-4">
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={value} placeholder="When is Christmas?" onChange={(e) => setValue(e.target.value)} />
        {!error && <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => getResponse()}>Ask me</button>}
        {error && <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={clear}>Clear</button>}
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <div key={index} className="mb-2 p-2 shadow-lg rounded bg-gray-100">
            <p className="text-md font-semibold">{chatItem.role}: <span className="text-md font-normal">{chatItem.content}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;