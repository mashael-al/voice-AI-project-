const recordBtn = document.getElementById("recordBtn");
const transcript = document.getElementById("transcript");
const responseText = document.getElementById("responseText");

// تهيئة Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "ar-SA";
recognition.interimResults = false;

recordBtn.addEventListener("click", () => {
  recognition.start();
  transcript.textContent = "جاري التسجيل... تحدث الآن";
  responseText.textContent = "";
});

recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
  transcript.textContent = speechToText;

  // إرسال النص لـ Cohere API
  sendToCohere(speechToText);
};

recognition.onerror = (event) => {
  transcript.textContent = "حدث خطأ في التسجيل: " + event.error;
};

async function sendToCohere(text) {
  responseText.textContent = "جاري التحميل...";

  try {
    const res = await fetch("https://api.cohere.ai/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer eWb9vJTj6v1zjKAjpeQsQWm7PrqEY9pgjAzUGvJX", // حط مفتاحك هنا
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-xlarge-nightly",
        prompt: text,
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!res.ok) throw new Error("خطأ في جلب الرد");

    const data = await res.json();
    const generatedText = data.generations[0].text.trim();
    responseText.textContent = generatedText;

    // تحويل الرد إلى صوت
    speak(generatedText);

  } catch (error) {
    responseText.textContent = "خطأ: " + error.message;
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  speechSynthesis.speak(utterance);
}

