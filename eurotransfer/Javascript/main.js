const languages = {
  fr: "French",
  de: "German",
  es: "Spanish",
  it: "Italian",
  pl: "Polish",
  nl: "Dutch",
  sv: "Swedish",
  pt: "Portuguese"
};

async function translateWord() {
  const word = document.getElementById("wordInput").value.trim();
  const container = document.getElementById("resultsContainer");
  container.innerHTML = ""; // Clear previous results

  if (!word) {
    container.innerHTML = "<p>Please enter a word to translate.</p>";
    return;
  }

  for (const [langCode, langName] of Object.entries(languages)) {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: word,
        source: "en",
        target: langCode,
        format: "text"
      })
    });

    const data = await response.json();
    const translation = data.translatedText;

    const result = document.createElement("p");
    result.innerHTML = `<strong>${langName}:</strong> ${translation}`;
    container.appendChild(result);
  }
}
