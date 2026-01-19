const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("promptInput");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");
const loadingText = document.getElementById("loadingText");
const timerText = document.getElementById("timerText");

// 🔥 IMPORTANT: Update this after deploying to Render
// Your current URL looks correct: https://textoimg01.onrender.com
const API_URL = "https://textoimg01.onrender.com/generate-image";

let timer = 0;
let interval;

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert("Please enter a prompt");
    return;
  }

  // Disable button while generating
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  // UI Reset
  loadingText.style.display = "block";
  timerText.style.display = "block";
  resultImage.style.display = "none";
  downloadBtn.style.display = "none";
  timer = 0;

  interval = setInterval(() => {
    timer++;
    timerText.innerText = `⏱ ${timer} seconds`;
  }, 1000);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Image generation failed");
    }

    const blob = await response.blob();
    const imageURL = URL.createObjectURL(blob);

    resultImage.src = imageURL;
    resultImage.style.display = "block";

    downloadBtn.style.display = "inline-block";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = imageURL;
      a.download = `ai-image-${Date.now()}.png`;
      a.click();
    };
  } catch (error) {
    alert(`Error: ${error.message}\n\nPlease make sure your backend is running and the API_URL is correct.`);
    console.error("Generation error:", error);
  } finally {
    clearInterval(interval);
    loadingText.style.display = "none";
    timerText.style.display = "none";
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate";
  }
});

// Allow Enter key to trigger generation
promptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !generateBtn.disabled) {
    generateBtn.click();
  }
});
