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

const langToCountryCode = {
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  pl: "PL",
  nl: "NL",
  sv: "SE",
  pt: "PT"
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
    try {
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

      // Add to the result list
      const result = document.createElement("p");
      result.innerHTML = `<strong>${langName}:</strong> ${translation}`;
      container.appendChild(result);

      // Update map tooltip and visible label
      const countryCode = langToCountryCode[langCode];
      if (countryCode) {
        simplemaps_europemap_mapdata.state_specific[countryCode].description = translation;
        createOrUpdateLabel(countryCode, translation);
      }
    } catch (error) {
      console.error(`Error for ${langCode}:`, error);
    }
  }

  simplemaps_europemap.load(); // Refresh the map
}

function createOrUpdateLabel(countryCode, translation) {
  const mapSvg = document.querySelector("#map svg");
  if (!mapSvg) return;

  // Remove existing label
  const existingLabel = document.getElementById(`label-${countryCode}`);
  if (existingLabel) {
    existingLabel.remove();
  }

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("id", `label-${countryCode}`);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "12");
  text.setAttribute("fill", "#000");
  text.textContent = translation;

  const positions = {
    FR: { x: 220, y: 180 },
    DE: { x: 270, y: 130 },
    ES: { x: 170, y: 250 },
    IT: { x: 260, y: 230 },
    PL: { x: 310, y: 100 },
    NL: { x: 250, y: 100 },
    SE: { x: 330, y: 40 },
    PT: { x: 150, y: 230 }
  };

  const pos = positions[countryCode];
  if (pos) {
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y);
    mapSvg.appendChild(text);
  }
}
