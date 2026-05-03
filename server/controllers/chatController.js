exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'Missing GROQ_API_KEY in .env'
            });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // Fast and capable model on Groq
                messages: [
                    {
                        role: "system",
                        content: `You are an AI Support Assistant for an EV Fleet Management System. 
                        The system helps users track charging stations, book charging slots, monitor EV battery and location, and manage fleet vehicles.
                        Be helpful, concise, and professional. You can answer questions about the platform, but also engage in general conversation.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch from Groq API");
        }

        const text = data.choices[0].message.content;

        res.status(200).json({ text });

    } catch (error) {
        console.error('FULL ERROR:', error);

        res.status(500).json({
            error: error.message
        });
    }
};
