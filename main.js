// main.js - Chatbot Script (No Push-To-Talk Version)

import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const micButton = document.getElementById("micButton");

    if (userInput) userInput.addEventListener("keypress", handleKeyPress);
    if (sendButton) sendButton.addEventListener("click", sendMessage);
    if (micButton) micButton.addEventListener("click", startVoiceRecognition);
});

async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const messageText = userInput.value.trim();
    if (messageText === "") return;

    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = messageText;
    chatMessages.appendChild(userMessage);
    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        console.log("Sending message:", messageText);
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: messageText })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.textContent = data.reply || data.output || "Erreur dans la réponse";
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error("API Error:", error);
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.textContent = "Impossible de contacter l'IA.";
        chatMessages.appendChild(errorMessage);
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Voice Recognition (No PTT)
function startVoiceRecognition() {
    try {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "fr-FR";

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById("userInput").value = transcript;
            sendMessage();
        };

        recognition.onerror = function(event) {
            console.error("Voice recognition error:", event.error);
        };

        recognition.start();
    } catch (error) {
        console.error("Speech Recognition is not supported in this browser.");
    }
}
