const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const apiKey = "AIzaSyCitPztEh-1CRZxtJWJ08b18FZWXngd8-Y";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, what is today's date?");
        console.log("Success:", await result.response.text());
    } catch (e) {
        console.error("Error details:", e);
    }
}

test();
