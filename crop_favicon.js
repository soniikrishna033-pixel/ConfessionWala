import { Jimp } from 'jimp';

async function cropRound() {
  const imagePath = "C:\\Users\\OCS\\.gemini\\antigravity\\brain\\2d7719d0-8d8b-4a9b-a7f1-ad3b37e3e49a\\media__1780592722382.png";
  console.log("Reading image:", imagePath);
  try {
    const image = await Jimp.read(imagePath);
    console.log("Image read successful. Processing...");

    const size = Math.min(image.bitmap.width, image.bitmap.height);
    
    image.crop({
      x: (image.bitmap.width - size) / 2,
      y: (image.bitmap.height - size) / 2,
      w: size,
      h: size
    });
    
    image.circle({
      radius: size / 2,
      x: size / 2,
      y: size / 2
    });
    
    const outPath = "c:\\CW\\public\\logo.png";
    await image.write(outPath);
    console.log("Successfully wrote to:", outPath);
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

cropRound();
