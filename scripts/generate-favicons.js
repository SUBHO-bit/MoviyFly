import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';

const SOURCE_FILE = 'public/favicon-source.png';
const VECTOR_SOURCE = 'public/assets/logo.svg';
const ASSETS_DIR = 'public/assets';

// Validate if PNG magic bytes are valid
function isPngCorruptedOrMissing() {
  if (!fs.existsSync(SOURCE_FILE)) {
    return true;
  }
  try {
    const buffer = fs.readFileSync(SOURCE_FILE);
    // PNG files must start with: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4E || buffer[3] !== 0x47) {
      return true; // Corrupted or incorrect format
    }
    return false;
  } catch (e) {
    return true;
  }
}

async function generateFavicons() {
  console.log('🚀 Starting centralized favicon generation...');

  // Create assets directory if it doesn't exist
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // 1. Check if we need to initialize or repair public/favicon-source.png from logo.svg
  if (isPngCorruptedOrMissing()) {
    console.log('🔮 Sourcing high-resolution favicon from vector logo.svg...');
    if (!fs.existsSync(VECTOR_SOURCE)) {
      console.error(`❌ Error: Vector logo source "${VECTOR_SOURCE}" is also missing.`);
      process.exit(1);
    }
    try {
      await sharp(VECTOR_SOURCE)
        .resize(512, 512)
        .png()
        .toFile(SOURCE_FILE);
      console.log(`  ✅ Restored clean, high-resolution source: ${SOURCE_FILE}`);
    } catch (err) {
      console.error('❌ Failed to render vector source to PNG:', err);
      process.exit(1);
    }
  }

  try {
    // 2. Generate PNG sizes
    console.log('🎨 Generating PNG assets...');
    
    // 16x16 Favicon
    await sharp(SOURCE_FILE)
      .resize(16, 16)
      .toFile(path.join(ASSETS_DIR, 'favicon-16x16.png'));
    console.log('  ✅ Generated assets/favicon-16x16.png');

    // 32x32 Favicon
    await sharp(SOURCE_FILE)
      .resize(32, 32)
      .toFile(path.join(ASSETS_DIR, 'favicon-32x32.png'));
    console.log('  ✅ Generated assets/favicon-32x32.png');

    // 180x180 Apple Touch Icon
    await sharp(SOURCE_FILE)
      .resize(180, 180)
      .toFile(path.join(ASSETS_DIR, 'apple-touch-icon.png'));
    console.log('  ✅ Generated assets/apple-touch-icon.png');

    // 192x192 PWA Icon
    await sharp(SOURCE_FILE)
      .resize(192, 192)
      .toFile(path.join(ASSETS_DIR, 'favicon-192x192.png'));
    console.log('  ✅ Generated assets/favicon-192x192.png');

    // 512x512 PWA Icon
    await sharp(SOURCE_FILE)
      .resize(512, 512)
      .toFile(path.join(ASSETS_DIR, 'favicon-512x512.png'));
    console.log('  ✅ Generated assets/favicon-512x512.png');

    // 3. Generate ICO file using png-to-ico
    console.log('📦 Converting to ICO format...');
    // Create a temporary 32x32 png for ico conversion to ensure perfect quality
    const tempIcoPng = path.join(ASSETS_DIR, 'temp-ico.png');
    await sharp(SOURCE_FILE)
      .resize(32, 32)
      .toFile(tempIcoPng);

    const icoBuffer = await pngToIco(tempIcoPng);
    fs.writeFileSync('public/favicon.ico', icoBuffer);
    
    // Clean up temp file
    if (fs.existsSync(tempIcoPng)) {
      fs.unlinkSync(tempIcoPng);
    }
    console.log('  ✅ Generated favicon.ico');

    console.log('🎉 Centered favicon system successfully updated all assets!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
