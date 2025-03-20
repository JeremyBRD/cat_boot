// main.js - Cat Boot Logic

import { API_URL } from "./config.js";

// Événement d'écoute des touches et boutons
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userInput").addEventListener("keypress", handleKeyPress);
    document.querySelector("button").addEventListener("click", sendMessage);
    document.getElementById("micButton").addEventListener("click", startListening);
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

// 🎤 Fonctionnalité de Microphone
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "fr-FR";
recognition.continuous = false;
recognition.interimResults = false;

function startListening() {
    recognition.start();
}

recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("userInput").value = transcript;
    sendMessage();
};

recognition.onerror = function (event) {
    console.error("Erreur de reconnaissance vocale:", event.error);
};
