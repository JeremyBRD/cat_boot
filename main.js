// main.js - Cat Boot Logic

import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userInput").addEventListener("keypress", handleKeyPress);
    document.querySelector("button").addEventListener("click", sendMessage);
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
        botMessage.textContent = data.reply || data.output || "Error in response";
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error("API Error:", error);
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.textContent = "Unable to contact AI.";
        chatMessages.appendChild(errorMessage);
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
