const PORT=8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()

const{GoogleGenerativeAI}= require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);
    
    
    const structuredHistory = []; // Define structuredHistory variable

    try {
        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: structuredHistory,
        });
        const msg = req.body.message;
        const result = await chat.sendMessage([msg]);
        const response = await result.response;
        const text = response.text();
        res.send(text);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

