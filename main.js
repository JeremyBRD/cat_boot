// main.js - Bug Fix iPhone + Micro 🚀🔥
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");
    const micButton = document.getElementById("micButton");

    userInput.addEventListener("keypress", handleKeyPress);
    sendButton.addEventListener("click", sendMessage);
    micButton.addEventListener("mousedown", startRecording);
    micButton.addEventListener("mouseup", stopRecording);

    /* ✅ Empêche toute sélection et focus du bouton micro */
    micButton.addEventListener("mousedown", (event) => event.preventDefault());
    micButton.addEventListener("contextmenu", (event) => event.preventDefault());
    micButton.addEventListener("focus", (event) => {
        event.preventDefault();
        micButton.blur();
    });
    micButton.addEventListener("click", () => micButton.blur());

    /* ✅ Désactive définitivement la sélection sur mobile */
    micButton.setAttribute("unselectable", "on");
    micButton.style.userSelect = "none";
    micButton.style.webkitUserSelect = "none";

    /* ✅ Demande d'autorisation micro en une fois */
    if (localStorage.getItem("micPermission") !== "granted") {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
            localStorage.setItem("micPermission", "granted");
        }).catch(() => {
            console.warn("L'utilisateur a refusé l'accès au micro.");
        });
    }
});

/* ✅ Fonction pour envoyer un message */
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
        console.log("Envoi du message :", messageText);
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: messageText })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Données reçues :", data);

        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.textContent = data.reply || data.output || "Erreur dans la réponse";
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error("Erreur API :", error);
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.textContent = "Impossible de contacter l'IA.";
        chatMessages.appendChild(errorMessage);
    }
}

/* ✅ Gestion du micro (Push-to-Talk) */
let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });
    }).catch(error => {
        console.error("Erreur d'accès au micro :", error);
    });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();

        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            sendAudio(audioBlob);
            audioChunks = [];
        });
    }
}

/* ✅ Fonction pour envoyer l'audio */
async function sendAudio(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
        const response = await fetch(API_URL + "/audio", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Réponse de l'API :", data);
    } catch (error) {
        console.error("Erreur d'envoi audio :", error);
    }
}

/* ✅ Gestion du clavier */
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
