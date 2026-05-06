import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

// Background
const bg = ctx.createLinearGradient(0, 0, 1200, 630);
bg.addColorStop(0, '#0a0a1a');
bg.addColorStop(0.5, '#1a0a2e');
bg.addColorStop(1, '#2d0a1e');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, 1200, 630);

// Glow circle
const glow = ctx.createRadialGradient(600, 315, 0, 600, 315, 400);
glow.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
glow.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, 1200, 630);

// RIVAL text
ctx.font = 'bold 180px Arial';
ctx.textAlign = 'center';
const gradient = ctx.createLinearGradient(300, 0, 900, 0);
gradient.addColorStop(0, '#8B5CF6');
gradient.addColorStop(1, '#EC4899');
ctx.fillStyle = gradient;
ctx.fillText('RIVAL', 600, 280);

// Tagline
ctx.font = 'bold 52px Arial';
ctx.fillStyle = '#ffffff';
ctx.fillText('Compete. Win. Repeat.', 600, 370);

// Sub
ctx.font = '34px Arial';
ctx.fillStyle = 'rgba(255,255,255,0.5)';
ctx.fillText('The competitive social platform', 600, 430);

// Dots
for (let i = 0; i < 5; i++) {
  ctx.beginPath();
  ctx.arc(420 + i * 90, 510, 5, 0, Math.PI * 2);
  ctx.fillStyle = i === 2 ? '#8B5CF6' : 'rgba(255,255,255,0.2)';
  ctx.fill();
}

const out = path.join(__dirname, '../public/og-image.png');
writeFileSync(out, canvas.toBuffer('image/png'));
console.log('OG image generated:', out);
