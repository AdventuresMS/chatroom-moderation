const API_KEY = "AIzaSyA2Y_HXggm6W3YGPKlaJ3-13Ndx-9CilqY";

async function analyzeToxicity(text) {
  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;

  const body = {
    comment: { text },
    languages: ["en"],
    requestedAttributes: { TOXICITY: {} },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    const score = result.attributeScores.TOXICITY.summaryScore.value;
    return score;
  } catch (error) {
    console.error("Error analyzing message:", error);
    return null;
  }
}

document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (!message) return;

  const score = await analyzeToxicity(message);
  const chatBox = document.getElementById("chat-box");
  const modBox = document.getElementById("moderator-box");

  chatBox.innerHTML += `<div>You: ${message}</div>`;
  input.value = "";

  if (score !== null) {
    const percentage = Math.round(score * 100);
    modBox.innerHTML += `<div>⚠️ Message flagged for TOXICITY score: ${percentage}%</div>`;
  } else {
    modBox.innerHTML += `<div>❌ Could not analyze message.</div>`;
  }
  console.log("Message sent:", message); // ADD THIS BELOW const message
  console.log("Toxicity score:", score); // ADD AFTER const score = await analyzeToxicity(message);
});
