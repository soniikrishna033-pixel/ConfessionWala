const functions = require("firebase-functions");
const { GlobalFonts, createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");
const fs = require("fs");

// Register fonts before handling any requests
// Ensure you place "Poppins-Bold.ttf" and "Poppins-Medium.ttf" in the functions/fonts directory
const fontsDir = path.join(__dirname, "fonts");
if (fs.existsSync(path.join(fontsDir, "Poppins-Bold.ttf"))) {
  GlobalFonts.registerFromPath(path.join(fontsDir, "Poppins-Bold.ttf"), "Poppins");
}
if (fs.existsSync(path.join(fontsDir, "Poppins-Medium.ttf"))) {
  GlobalFonts.registerFromPath(path.join(fontsDir, "Poppins-Medium.ttf"), "Poppins");
}

// Helper function to wrap text within a maximum width
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, currentY);
}

exports.generateShareImage = functions.https.onRequest(async (req, res) => {
  // Setup CORS to allow the frontend to fetch the image directly
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  try {
    const confessionText = req.query.text || req.body.text || "No confession provided.";
    const confessionNum = req.query.num || req.body.num || "N/A";

    // Dimensions for the image_5.png template
    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Load the background template (image_5.png)
    const templatePath = path.join(__dirname, "image_5.png");
    
    // Fallback if the image doesn't exist just to prevent fatal crashes during dev
    if (!fs.existsSync(templatePath)) {
      ctx.fillStyle = "#fff9e9";
      ctx.fillRect(0, 0, width, height);
    } else {
      const bgImage = await loadImage(templatePath);
      ctx.drawImage(bgImage, 0, 0, width, height);
    }

    // Render "Confession Num: #{num}" in the top right star area
    ctx.fillStyle = "#3f0009"; 
    ctx.font = "bold 28px Poppins";
    ctx.textAlign = "right";
    ctx.fillText(`Confession #${confessionNum}`, width - 100, 140);

    // Dynamic font sizing for long confessions to ensure they fit inside the creme body
    let fontSize = 48;
    if (confessionText.length > 150) fontSize = 42;
    if (confessionText.length > 250) fontSize = 36;
    if (confessionText.length > 400) fontSize = 32;
    if (confessionText.length > 600) fontSize = 28;
    
    ctx.font = `${fontSize}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    // Boundary parameters for the text wrap
    const maxTextWidth = 720;
    const lineHeight = fontSize * 1.5;
    const startX = width / 2;
    
    // Estimate text height to center vertically
    const approximateLines = Math.ceil(ctx.measureText(confessionText).width / maxTextWidth);
    const totalTextHeight = approximateLines * lineHeight;
    
    // Start Y dynamically adjusts so the block of text is centered vertically
    const startY = (height / 2) - (totalTextHeight / 2) + 40; 
    
    wrapText(ctx, confessionText, startX, startY, maxTextWidth, lineHeight);

    // Send the image binary stream
    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
    res.send(buffer);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("Internal Server Error");
  }
});
