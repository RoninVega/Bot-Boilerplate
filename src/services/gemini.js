require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializamos la API con la clave de tu .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Elegimos el modelo. El flash es rapidísimo e ideal para bots de chat
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); 

async function generateResponse(prompt) {
    try {
        // Acá le mandamos el texto del cliente a la IA
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('❌ Error en Gemini:', error);
        return '🤖 Uy, se me cruzaron los cables. Dame un segundito y volvé a intentarlo.';
    }
}

module.exports = { generateResponse };