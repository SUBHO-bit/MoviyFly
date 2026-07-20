import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Solid Black Background to match the uploaded reference -->
  <rect width="512" height="512" fill="#000000" />
  
  <defs>
    <!-- Beautiful Ambient Purple Glow behind the butterfly -->
    <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <g filter="url(#purple-glow)">
    <!-- LEFT SIDE OF BUTTERFLY (Symmetrically mirrored to the right side) -->
    <g id="left-butterfly-wing">
      <!-- Dark Silhouette Backing of Left Upper Wing -->
      <path d="M256,180 C210,110 120,100 80,140 C50,170 55,230 85,270 C105,295 150,310 256,310 Z" fill="#090810" stroke="#1D1233" stroke-width="4" />
      
      <!-- Dark Silhouette Backing of Left Lower Wing -->
      <path d="M256,310 C180,310 110,340 115,390 C120,440 180,470 230,450 C245,440 250,410 256,380 Z" fill="#090810" stroke="#1D1233" stroke-width="4" />

      <!-- Crystal Facets: Left Upper Wing -->
      <!-- Inner Deep Base -->
      <polygon points="256,210 210,160 160,180" fill="#2E1065" opacity="0.95" />
      <polygon points="210,160 160,180 120,130" fill="#4C1D95" opacity="0.95" />
      <polygon points="256,210 210,160 256,250" fill="#1E1B4B" opacity="0.95" />
      
      <!-- Middle Bright Facets -->
      <polygon points="210,160 170,220 256,250" fill="#7C3AED" opacity="0.9" />
      <polygon points="160,180 120,130 90,160" fill="#6D28D9" opacity="0.9" />
      <polygon points="160,180 120,210 170,220" fill="#8B5CF6" opacity="0.95" />
      <polygon points="120,130 90,160 95,210" fill="#7C3AED" opacity="0.9" />
      <polygon points="160,180 120,210 95,210" fill="#A78BFA" opacity="0.9" />
      
      <!-- Outer Edge Highlight Facets -->
      <polygon points="120,210 170,220 140,265" fill="#DDD6FE" opacity="0.95" />
      <polygon points="120,210 95,210 85,245" fill="#A855F7" opacity="0.9" />
      <polygon points="120,210 85,245 140,265" fill="#C084FC" opacity="0.95" />
      <polygon points="170,220 256,250 210,285" fill="#5B21B6" opacity="0.9" />
      <polygon points="170,220 140,265 210,285" fill="#8B5CF6" opacity="0.95" />
      <polygon points="140,265 210,285 180,305" fill="#C084FC" opacity="0.95" />
      <polygon points="140,265 85,245 105,285" fill="#7C3AED" opacity="0.9" />
      <polygon points="140,265 105,285 180,305" fill="#A78BFA" opacity="0.9" />
      <polygon points="105,285 180,305 150,307" fill="#DDD6FE" opacity="0.9" />
      <polygon points="210,285 256,250 256,310" fill="#3B0764" opacity="0.95" />
      <polygon points="210,285 256,310 230,310" fill="#4C1D95" opacity="0.95" />
      <polygon points="180,305 210,285 230,310" fill="#8B5CF6" opacity="0.95" />

      <!-- Crystal Facets: Left Lower Wing -->
      <polygon points="256,310 230,335 180,350" fill="#1E1B4B" opacity="0.95" />
      <polygon points="256,310 256,380 210,390" fill="#3B0764" opacity="0.95" />
      <polygon points="256,310 210,390 230,335" fill="#4C1D95" opacity="0.95" />
      <polygon points="230,335 180,350 160,395" fill="#5B21B6" opacity="0.9" />
      <polygon points="230,335 210,390 160,395" fill="#7C3AED" opacity="0.95" />
      <polygon points="180,350 140,360 120,400" fill="#6D28D9" opacity="0.9" />
      <polygon points="180,350 160,395 120,400" fill="#8B5CF6" opacity="0.95" />
      <polygon points="160,395 120,400 145,435" fill="#A78BFA" opacity="0.9" />
      <polygon points="160,395 210,390 180,440" fill="#8B5CF6" opacity="0.95" />
      <polygon points="160,395 145,435 180,440" fill="#DDD6FE" opacity="0.95" />
      <polygon points="210,390 256,380 240,445" fill="#2E1065" opacity="0.9" />
      <polygon points="210,390 180,440 240,445" fill="#4C1D95" opacity="0.95" />
      <polygon points="256,380 256,450 240,445" fill="#1E1B4B" opacity="0.95" />

      <!-- Thick, dark outer margins -->
      <path d="M80,140 C50,170 55,230 85,270" stroke="#000000" stroke-width="12" fill="none" stroke-linecap="round" />
      <path d="M115,390 C120,440 180,470 230,450" stroke="#000000" stroke-width="12" fill="none" stroke-linecap="round" />

      <!-- Delicate White spots along outer upper wing edge -->
      <circle cx="80" cy="140" r="3" fill="#FFFFFF" />
      <circle cx="68" cy="165" r="3.5" fill="#FFFFFF" />
      <circle cx="62" cy="195" r="3.5" fill="#FFFFFF" />
      <circle cx="66" cy="225" r="3.5" fill="#FFFFFF" />
      <circle cx="78" cy="255" r="3" fill="#FFFFFF" />
      <circle cx="95" cy="280" r="2.5" fill="#FFFFFF" />
      
      <!-- Delicate White spots along outer lower wing edge -->
      <circle cx="120" cy="390" r="2.5" fill="#FFFFFF" />
      <circle cx="128" cy="415" r="3.5" fill="#FFFFFF" />
      <circle cx="145" cy="440" r="3.5" fill="#FFFFFF" />
      <circle cx="170" cy="455" r="3.5" fill="#FFFFFF" />
      <circle cx="200" cy="460" r="3" fill="#FFFFFF" />
      <circle cx="225" cy="452" r="2.5" fill="#FFFFFF" />
    </g>

    <!-- RIGHT SIDE OF BUTTERFLY (Symmetrically Mirrored) -->
    <use href="#left-butterfly-wing" transform="translate(512, 0) scale(-1, 1)" />

    <!-- CENTRAL BODY -->
    <!-- Elegantly styled segmented body with gradient and soft highlight -->
    <g id="butterfly-body">
      <!-- Antennae -->
      <path d="M253,170 Q240,110 205,120" stroke="#A78BFA" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M259,170 Q272,110 307,120" stroke="#A78BFA" stroke-width="3" stroke-linecap="round" fill="none" />
      <circle cx="205" cy="120" r="3.5" fill="#DDD6FE" />
      <circle cx="307" cy="120" r="3.5" fill="#DDD6FE" />

      <!-- Abdomen segment shading -->
      <ellipse cx="256" cy="340" rx="9" ry="65" fill="#12101A" stroke="#312E81" stroke-width="2" />
      <!-- Thorax -->
      <ellipse cx="256" cy="245" rx="12" ry="32" fill="#171424" stroke="#4C1D95" stroke-width="2.5" />
      <!-- Head -->
      <circle cx="256" cy="188" r="11" fill="#1E1B4B" stroke="#6D28D9" stroke-width="2" />
      <!-- Eyes -->
      <circle cx="248" cy="182" r="3" fill="#DDD6FE" />
      <circle cx="264" cy="182" r="3" fill="#DDD6FE" />

      <!-- Segment Highlights (Horizontal lines across abdomen) -->
      <line x1="250" y1="300" x2="262" y2="300" stroke="#A78BFA" stroke-width="2" opacity="0.6" stroke-linecap="round" />
      <line x1="248" y1="320" x2="264" y2="320" stroke="#A78BFA" stroke-width="2" opacity="0.6" stroke-linecap="round" />
      <line x1="247" y1="340" x2="265" y2="340" stroke="#A78BFA" stroke-width="2" opacity="0.6" stroke-linecap="round" />
      <line x1="248" y1="360" x2="264" y2="360" stroke="#A78BFA" stroke-width="2" opacity="0.6" stroke-linecap="round" />
      <line x1="250" y1="380" x2="262" y2="380" stroke="#A78BFA" stroke-width="2" opacity="0.6" stroke-linecap="round" />
    </g>
  </g>
</svg>
`;

async function main() {
  console.log('🦋 Generating high-resolution crystal butterfly vectors...');
  
  // Write to public/assets/logo.svg
  fs.writeFileSync('public/assets/logo.svg', SVG_CONTENT);
  console.log('  ✅ Wrote public/assets/logo.svg');

  // Convert SVG to PNG at 512x512
  await sharp('public/assets/logo.svg')
    .resize(512, 512)
    .png()
    .toFile('public/favicon-source.png');
  console.log('  ✅ Rendered public/favicon-source.png (512x512)');

  // Run the existing favicon generation system
  console.log('⚡ Triggering existing favicon assets generation system...');
  const generateModule = await import('./generate-favicons.js');
  console.log('✨ Favicon regeneration complete!');
}

main().catch(console.error);
