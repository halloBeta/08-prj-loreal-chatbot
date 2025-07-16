/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const CLOUDFLARE_WORKER_URL = "https://billowing-resonance-abf5.dkotthak.workers.dev/";

const systemPrompt = {
  role: "system",
  content: `You are a helpful AI assistant for L’Oréal. Only answer questions related to L’Oréal’s products, including makeup, skincare, haircare, and fragrances. You may also offer beauty routines and recommendations using L’Oréal products. Politely decline unrelated queries.`
};

// Display welcome message
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! I'm your L’Oréal Smart Product Advisor. Ask me about makeup, skincare, haircare, or fragrance recommendations!</div>`;

// Append a message to chat window
function appendMessage(content, sender = "user") {
  const msg = document.createElement("div");
  msg.classList.add("msg", sender);
  msg.textContent = content;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  appendMessage("⏳ Thinking...", "ai");

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [systemPrompt, { role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response.";

    // Replace the “Thinking...” message
    const thinkingMsg = chatWindow.querySelector(".msg.ai:last-child");
    thinkingMsg.textContent = reply;

  } catch (err) {
    const errorMsg = chatWindow.querySelector(".msg.ai:last-child");
    errorMsg.textContent = "⚠️ Sorry, something went wrong. Please try again.";
    console.error(err);
  }
});

