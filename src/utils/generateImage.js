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

// Helper to safely draw a rounded rectangle with individual corner radii
function drawRoundRectComplex(ctx, x, y, width, height, radii) {
  ctx.beginPath();
  ctx.moveTo(x + radii.tl, y);
  ctx.lineTo(x + width - radii.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii.tr);
  ctx.lineTo(x + width, y + height - radii.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii.br, y + height);
  ctx.lineTo(x + radii.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii.bl);
  ctx.lineTo(x, y + radii.tl);
  ctx.quadraticCurveTo(x, y, x + radii.tl, y);
  ctx.closePath();
}

export async function generateShareImageBlob(confessionText, confessionNum) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const width = 1080;
      const height = 1920; // 9:16 vertical ratio
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const logoImage = new Image();
      logoImage.crossOrigin = "anonymous";
      logoImage.src = "/logo.png";

      Promise.all([
        document.fonts.ready,
        new Promise((res) => {
          logoImage.onload = () => res(true);
          logoImage.onerror = () => res(false);
        })
      ]).then(([_, logoLoaded]) => {
        // 1. Fill background (off-white)
        ctx.fillStyle = "#FEF9F1"; 
        ctx.fillRect(0, 0, width, height);

        // 2. Measure tab text
        const tabFontSize = 40;
        ctx.font = `bold ${tabFontSize}px Poppins, sans-serif`;
        const tabText = `Confession #${confessionNum}`;
        const tabTextWidth = ctx.measureText(tabText).width;
        const tabPaddingX = 40;
        const tabPaddingY = 24;
        const tabWidth = tabTextWidth + (tabPaddingX * 2);
        const tabHeight = tabFontSize + (tabPaddingY * 2);

        // 3. Measure main text
        let fontSize = 54;
        if (confessionText.length > 150) fontSize = 48;
        if (confessionText.length > 300) fontSize = 42;
        if (confessionText.length > 500) fontSize = 36;
        
        ctx.font = `400 ${fontSize}px Poppins, sans-serif`;
        const maxTextWidth = 800; 
        const lineHeight = fontSize * 1.5;
        const lines = getWrappedLines(ctx, confessionText, maxTextWidth);
        
        const mainBoxPaddingY = 100;
        const totalTextHeight = lines.length * lineHeight;
        const boxHeight = totalTextHeight + (mainBoxPaddingY * 2);
        const boxWidth = 920; 
        
        // 4. Calculate total block height to center
        const totalBlockHeight = tabHeight + boxHeight;
        let startY = (height / 2) - (totalBlockHeight / 2) - 50; 
        
        const startX = (width - boxWidth) / 2; // 80
        
        // 5. Draw Tab
        ctx.fillStyle = "#FAD4DC"; // light pink
        drawRoundRectComplex(ctx, startX, startY, tabWidth, tabHeight, {tl: 24, tr: 24, br: 0, bl: 0});
        ctx.fill();

        ctx.fillStyle = "#3A0815"; // dark text
        ctx.font = `bold ${tabFontSize}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tabText, startX + (tabWidth / 2), startY + (tabHeight / 2) + 2); 
        
        // 6. Draw Main Box
        const boxY = startY + tabHeight;
        ctx.fillStyle = "#CE1461"; // vibrant pink
        drawRoundRectComplex(ctx, startX, boxY, boxWidth, boxHeight, {tl: 0, tr: 30, br: 30, bl: 30});
        ctx.fill();

        // 7. Draw Main Text
        ctx.fillStyle = "#FEF9F1"; // off-white text
        ctx.font = `400 ${fontSize}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        let currentY = boxY + mainBoxPaddingY + (lineHeight / 2);
        for (const line of lines) {
           ctx.fillText(line, width / 2, currentY);
           currentY += lineHeight;
        }

        // 8. Draw footer (Logo + domain)
        const domainText = "www.confessionwala.in";
        ctx.font = `bold 36px Poppins, sans-serif`;
        const domainWidth = ctx.measureText(domainText).width;
        const logoSize = 60;
        const logoGap = 20;
        const totalFooterWidth = domainWidth + logoSize + logoGap;
        
        const footerX = (width - totalFooterWidth) / 2;
        const footerY = height - 120;

        if (logoLoaded) {
          ctx.drawImage(logoImage, footerX, footerY - (logoSize / 2), logoSize, logoSize);
        } else {
          // Fallback icon (circle with a triangle inside)
          ctx.beginPath();
          ctx.arc(footerX + logoSize/2, footerY, logoSize/2, 0, Math.PI * 2);
          ctx.strokeStyle = "#CE1461";
          ctx.lineWidth = 4;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(footerX + logoSize/2, footerY - 12);
          ctx.lineTo(footerX + logoSize/2 - 12, footerY + 12);
          ctx.lineTo(footerX + logoSize/2 + 12, footerY + 12);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.fillStyle = "#CE1461";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(domainText, footerX + logoSize + logoGap, footerY + 2);

        canvas.toBlob((blob) => resolve(blob), "image/png");
      });
    } catch (err) {
      reject(err);
    }
  });
}

