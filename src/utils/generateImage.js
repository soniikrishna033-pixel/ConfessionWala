// src/utils/generateImage.js

function getWrappedLines(context, text, maxWidth) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine.trim());
      currentLine = words[n] + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
}

// Helper to safely draw a rounded rectangle on all browsers
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export async function generateShareImageBlob(confessionText, confessionNum) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Load background template from the public folder
      const bgImage = new Image();
      bgImage.crossOrigin = "anonymous";
      bgImage.src = "/image_5.png"; // Requires image_5.png in public/

      bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, width, height);

        // Ensure document fonts (Poppins) are fully loaded before drawing
        document.fonts.ready.then(() => {
          
          // Confession Count Pill settings
          const countFontSize = 48;
          ctx.font = `bold ${countFontSize}px Poppins, sans-serif`;
          const countText = `Confession #${confessionNum}`;
          const countTextWidth = ctx.measureText(countText).width;
          const pillPaddingX = 40;
          const pillPaddingY = 16;
          const pillWidth = countTextWidth + (pillPaddingX * 2);
          const pillHeight = countFontSize + (pillPaddingY * 2);
          const gap = 50; // space between pill and main text

          // Dynamic font sizing for main text (medium weight, smaller)
          let fontSize = 48;
          if (confessionText.length > 150) fontSize = 42;
          if (confessionText.length > 300) fontSize = 36;
          if (confessionText.length > 500) fontSize = 32;
          
          const maxTextWidth = 800; 
          const lineHeight = fontSize * 1.5;

          // 1. Calculate lines of main text FIRST to determine total height
          // Using 500 for medium weight
          ctx.font = `500 ${fontSize}px Poppins, sans-serif`;
          const lines = getWrappedLines(ctx, confessionText, maxTextWidth);
          
          const totalTextHeight = lines.length * lineHeight;
          const totalBlockHeight = pillHeight + gap + totalTextHeight;
          
          // 2. Start Y position so the entire block is dead center
          let currentY = (height / 2) - (totalBlockHeight / 2) + 10; 

          // 3. Draw Pill Background
          ctx.fillStyle = "#fff9e9"; // offwhite
          const pillX = (width / 2) - (pillWidth / 2);
          drawRoundRect(ctx, pillX, currentY, pillWidth, pillHeight, 30); // 30px rounded corners
          ctx.fill();

          // 4. Draw Confession Number (inside Pill)
          ctx.fillStyle = "#3f0009"; // dark pink text
          ctx.font = `bold ${countFontSize}px Poppins, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // Center vertically inside the pill
          ctx.fillText(countText, width / 2, currentY + (pillHeight / 2) + 2); 
          
          currentY += pillHeight + gap;

          // 5. Render Main Confession Text
          ctx.fillStyle = "#fff9e9"; // offwhite text for body
          ctx.font = `500 ${fontSize}px Poppins, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          for (const line of lines) {
             ctx.fillText(line, width / 2, currentY);
             currentY += lineHeight;
          }

          // Generate Blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob failed"));
            }
          }, "image/png");
        });
      };

      bgImage.onerror = () => {
        console.error("Failed to load /image_5.png from public folder.");
        // Fallback if image_5.png is missing
        ctx.fillStyle = "#fff9e9";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#3f0009"; 
        ctx.font = "bold 48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Missing image_5.png in public folder", width/2, height/2);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
    } catch (err) {
      reject(err);
    }
  });
}
