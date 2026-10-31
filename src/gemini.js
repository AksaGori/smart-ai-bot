

import { prevUser } from "./context/UserContext";

const Api_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

export async function generateResponse() {
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    { "text": prevUser.prompt },
                    ...(prevUser.data ? [{
                        "inline_data": {
                            "mime_type": prevUser.mime_type,
                            "data": prevUser.data
                        }
                    }] : [])
                ]
            }]

        })
    }
    try {
        console.time("Gemini response time");
        let respones = await fetch(Api_Url, RequestOption)
        let data = await respones.json()
console.timeEnd("Gemini response time");
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        return apiResponse
    } catch (error) {
    console.log("Gemini API Error:", error);
}
}

