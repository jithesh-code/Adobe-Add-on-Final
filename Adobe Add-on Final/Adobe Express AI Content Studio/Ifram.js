import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
  console.log("✅ addOnUISdk is ready.");

  const { runtime } = addOnUISdk.instance;
  const scriptApi = await runtime.apiProxy("documentSandbox");

  const generateBtn = document.getElementById("generate");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");

  generateBtn.addEventListener("click", async () => {
    loading.style.display = "flex";
    results.style.display = "none";

    const description = document.getElementById("description").value;
    const platform = document.getElementById("platform").value;
    const tone = document.getElementById("tone").value;

    const prompt = `
You are a marketing copy expert. Return ONLY valid JSON with caption, hashtags, and callToAction.

Campaign Description: ${description}
Platform: ${platform}
Tone: ${tone}

Do not use markdown syntax or backticks. Only respond like:
{
  "caption": "...",
  "hashtags": "...",
  "callToAction": "..."
}
`.trim();

     try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      });
      const json = await response.json();
      let text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (text.startsWith("```json") || text.startsWith("```")) {
        text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();
      }

      const data = JSON.parse(text);

      loading.style.display = "none";
      results.style.display = "block";

      document.getElementById("caption").textContent = data.caption;
      document.getElementById("hashtags").textContent = data.hashtags;
      document.getElementById("cta").textContent = data.callToAction;

      document.getElementById("copy").onclick = () => {
        const full = `Caption: ${data.caption}\n\nHashtags: ${data.hashtags}\n\nCTA: ${data.callToAction}`;
        navigator.clipboard.writeText(full);
        alert("📋 Copied to clipboard!");
      };

      document.getElementById("insert").onclick = () => {
        scriptApi.insertMarketingCopy(`${data.caption}\n${data.hashtags}\n${data.callToAction}`);
      };
    } catch (err) {
      loading.style.display = "none";
      alert("⚠️ Failed to generate or parse content.");
      console.error("AI parsing error:", err);
    }
  });
});