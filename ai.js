const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let conversationHistory = [];
let model;
let kbVectors = [];
let isReady = false;

const knowledgeBase = [
  { q: "who is clarke", a: "Clarke Pudpud is my creator and developer! 💻" },
  { q: "who is clarke pudpud", a: "Clarke Pudpud is my creator and developer! 💻" },
  { q: "who made you", a: "I was created by Clarke Pudpud ✨" },
  { q: "hello", a: "Hi there! I'm AC 👋" },
  { q: "hi", a: "Hello! How can I help you today?" },
  { q: "how are you", a: "I'm doing great! Thanks for asking 😊" },
  { q: "who are you", a: "I’m AC - Artificial Clone, Clarke’s AI chatbot." },
  { q: "who made you", a: "I was created by Clarke Pudpud ✨" },
  { q: "who created you", a: "Clarke Pudpud is my creator and developer! 💻" },
  { q: "what is your purpose", a: "I’m here to help answer your questions and act like Clarke’s digital twin 🤖" },
  { q: "what can you do", a: "I can answer questions about Clarke and help simulate a chatbot experience!" },
  { q: "projects", a: "Clarke is working on his personal website and AI chatbot 🚀" },
  { q: "what are clarke's projects", a: "Clarke’s main projects are this portfolio and an AI chatbot like me 🤖" },
  { q: "kamusta", a: "Ayos lang ako! Ikaw? 😊" },
  { q: "unsa imong ngalan", a: "Ako si AC, Artificial Clone 🤖" },
  { q: "sino gumawa sayo", a: "Ginawa ako ni Clarke ✨" },
  { q: "clarke is good", a: "Yes! Clarke is awesome and my creator! 😄" },
  { q: "thank you", a: "You're welcome! 😊" },
  { q: "salamat", a: "Walang anuman! 😃" },
  { q: "where is clarke", a: "Clarke is probably coding something cool right now 👨‍💻" },
  { q: "are you real", a: "I'm not a human, but I'm here to chat with you like one!" },
  { q: "do you speak tagalog", a: "Oo naman! Marunong ako mag-Tagalog 😊" },
  { q: "do you speak bisaya", a: "Oo, kabalo pud ko gamay'g Bisaya 😉" },
  { q: "ilang taon kana", a: "Wala akong edad kasi AI lang ako 😅" }
];

const fallbackResponses = [
  "Hmm 🤔 interesting question. Let me think...",
  "I’m not sure yet, but I’ll learn that soon!",
  "That’s a good one! Clarke might teach me more about it.",
  "Can you tell me more about that?",
  "I'm still learning. Clarke is feeding me knowledge little by little 🧠",
  "I wish I knew more about that. Try asking Clarke directly! 😉",
  "That sounds deep... care to explain more?"
];

function addMessage(text, type) {
  let msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function preprocess(text) {
  return text.toLowerCase().replace(/[?!.]/g, '').trim();
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

async function loadModel() {
  addMessage("Loading AI model... Please wait.", "bot");
  model = await use.load();
  addMessage("AI model loaded! Ask me anything 😊", "bot");
}

async function encodeKnowledgeBase() {
  const questions = knowledgeBase.map(item => preprocess(item.q));
  const embeddings = await model.embed(questions);
  kbVectors = embeddings.arraySync();
}

async function prepareKB() {
  if (!model) await loadModel();
  await encodeKnowledgeBase();
  isReady = true;
}

async function getAIResponse(message) {
  if (!isReady) {
    return "Please wait, loading AI model...";
  }

  conversationHistory.push({ role: "user", content: message });

  const messageClean = preprocess(message);
  const messageEmbedding = await model.embed([messageClean]);
  const messageVector = messageEmbedding.arraySync()[0];

  let bestScore = 0;
  let bestAnswer = null;

  for (let i = 0; i < kbVectors.length; i++) {
    const score = cosineSimilarity(messageVector, kbVectors[i]);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = knowledgeBase[i].a;
    }
  }

  if (bestScore >= 0.3) {
    conversationHistory.push({ role: "ac", content: bestAnswer });
    return bestAnswer;
  } else {
    const reply = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    conversationHistory.push({ role: "ac", content: reply });
    return reply;
  }
}

sendBtn.addEventListener("click", async () => {
  let text = userInput.value.trim();
  if (text !== "") {
    addMessage(text, "user");
    userInput.value = "";

    let reply = await getAIResponse(text);
    setTimeout(() => addMessage(reply, "bot"), 500);
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Start loading model and preparing KB
prepareKB();