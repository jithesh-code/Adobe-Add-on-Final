import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

function start() {
  const sandboxApi = {
    insertMarketingCopy: async (content) => {
      const context = editor.context;
      const selection = await context.getSelection();

      if (Array.isArray(selection) && selection.length > 0 && selection[0].type === "text") {
        await selection[0].replace(content);
      } else {
        const textNode = await context.addText({
          content,
          x: 100,
          y: 100,
          fontSize: 18,
          fontFamily: "Poppins",
          color: "#0A0A0A"
        });
        console.log("✅ Inserted text element:", textNode.id);
      }
    }
  };

  runtime.exposeApi(sandboxApi);
}

start();