import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import expressSdk from "express-document-sdk";

const editor = expressSdk?.editor;

if (!editor?.insertText) {
  console.error("[DocumentJS] ❌ editor.insertText() is not available.");
} else {
  console.log("[DocumentJS] ✅ editor.insertText() is available.");
}

addOnSandboxSdk.instance.runtime.exposeApi({
  async insertTips(tipsArray) {
    console.log("[DocumentJS] 📩 insertTips received: ", tipsArray);

    if (!Array.isArray(tipsArray) || tipsArray.length === 0) {
      console.warn("[DocumentJS] ⚠️ No tips provided or invalid format.");
      return;
    }

    const formatted =
      "💡 AI Marketing Suggestions\n\n" + tipsArray.map((t) => `• ${t}`).join("\n");

    try {
      await editor.insertText(formatted);
      console.log("[DocumentJS] ✅ Tips inserted into canvas.");
    } catch (err) {
      console.error("[DocumentJS] ❌ Failed to insert text:", err);
    }
  },
});

console.log("[DocumentJS] ✅ Document APIs exposed via runtime.");
