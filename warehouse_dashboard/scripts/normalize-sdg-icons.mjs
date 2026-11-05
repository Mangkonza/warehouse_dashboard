import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  let sharp;
  try {
    const sharpModule = await import('sharp');
    sharp = sharpModule.default || sharpModule;
  } catch (err) {
    console.error('Sharp is not ready yet:', err.message);
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, '..');
  const sourceDir = path.join(projectRoot, 'public', 'assets', 'SDGs');
  const backupDir = path.resolve(projectRoot, '..', 'data_backup', 'assets_SDGs_original');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`Source dir: ${sourceDir}`);
  console.log(`Backup dir: ${backupDir}`);

  // Backup original files
  const originalFiles = fs.readdirSync(sourceDir);
  for (const file of originalFiles) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(backupDir, file);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`Backed up ${originalFiles.length} files to ${backupDir}`);

  // Extract wheel icon from prototype if not present
  const prototypePath = 'C:/Users/Paradise.paar/.gemini/antigravity/brain/6c0f591c-6588-48cf-83b0-2874d8d98157/.user_uploaded/media_1793878446905_fd4e3118.html';
  let wheelBuffer = null;
  if (fs.existsSync(prototypePath)) {
    const htmlContent = fs.readFileSync(prototypePath, 'utf8');
    const m = htmlContent.match(/IMG=\[([\s\S]*?)\];/);
    if (m) {
      try {
        const items = eval('[' + m[1] + ']');
        if (items && items[17]) {
          wheelBuffer = Buffer.from(items[17].split(',')[1], 'base64');
          console.log('Successfully extracted SDG Wheel icon from prototype HTML.');
        }
      } catch (e) {
        console.warn('Could not parse IMG array for wheel icon:', e.message);
      }
    }
  }

  // File mapping for SDGs 1-17
  const sdgFiles = [
    { num: 1, name: 'SDG1.jpg' },
    { num: 2, name: 'SDG2.jpg' },
    { num: 3, name: 'SDG3.png' },
    { num: 4, name: 'SDG4.png' },
    { num: 5, name: 'SDG5.jpg' },
    { num: 6, name: 'SDG6.png' },
    { num: 7, name: 'SDG7.jpg' },
    { num: 8, name: 'SDG8.jpg' },
    { num: 9, name: 'SDG9.jpg' },
    { num: 10, name: 'SDG10.jpg' },
    { num: 11, name: 'SDG11.jpg' },
    { num: 12, name: 'SDG12.jpg' },
    { num: 13, name: 'SDG13.jpg' },
    { num: 14, name: 'SDG14.jpg' },
    { num: 15, name: 'SDG15.jpg' },
    { num: 16, name: 'SDG16.jpg' },
    { num: 17, name: 'SDG17.jpg' },
  ];

  const results = [];

  for (const item of sdgFiles) {
    const srcPath = path.join(backupDir, item.name);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}`);
      continue;
    }

    const origStat = fs.statSync(srcPath);
    const origMeta = await sharp(srcPath).metadata();

    const paddedNum = String(item.num).padStart(2, '0');
    const targetName = `sdg-${paddedNum}.png`;
    const targetPath = path.join(sourceDir, targetName);

    // Resize to 512x512 square PNG with optimization
    await sharp(srcPath)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center',
      })
      .png({
        quality: 85,
        compressionLevel: 9,
        palette: true,
      })
      .toFile(targetPath);

    const newStat = fs.statSync(targetPath);
    const newMeta = await sharp(targetPath).metadata();

    results.push({
      item: `SDG ${item.num}`,
      originalFile: item.name,
      origFormat: origMeta.format?.toUpperCase(),
      origDim: `${origMeta.width}x${origMeta.height}`,
      origSize: (origStat.size / 1024).toFixed(1) + ' KB',
      newFile: targetName,
      newFormat: newMeta.format?.toUpperCase(),
      newDim: `${newMeta.width}x${newMeta.height}`,
      newSize: (newStat.size / 1024).toFixed(1) + ' KB',
    });
  }

  // Normalize Wheel icon
  if (wheelBuffer) {
    const wheelTargetName = 'sdg-wheel.png';
    const wheelTargetPath = path.join(sourceDir, wheelTargetName);
    const origWheelMeta = await sharp(wheelBuffer).metadata();
    const origWheelSize = (wheelBuffer.length / 1024).toFixed(1) + ' KB';

    await sharp(wheelBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({
        quality: 85,
        compressionLevel: 9,
        palette: true,
      })
      .toFile(wheelTargetPath);

    const newWheelStat = fs.statSync(wheelTargetPath);
    const newWheelMeta = await sharp(wheelTargetPath).metadata();

    results.push({
      item: 'SDG Wheel (Logo)',
      originalFile: 'prototype base64',
      origFormat: origWheelMeta.format?.toUpperCase(),
      origDim: `${origWheelMeta.width}x${origWheelMeta.height}`,
      origSize: origWheelSize,
      newFile: wheelTargetName,
      newFormat: newWheelMeta.format?.toUpperCase(),
      newDim: `${newWheelMeta.width}x${newWheelMeta.height}`,
      newSize: (newWheelStat.size / 1024).toFixed(1) + ' KB',
    });
  }

  // Clean up legacy non-standard files in public/assets/SDGs so only clean standardized files exist
  for (const item of sdgFiles) {
    const legacyPath = path.join(sourceDir, item.name);
    if (fs.existsSync(legacyPath) && !item.name.startsWith('sdg-')) {
      fs.unlinkSync(legacyPath);
    }
  }

  console.table(results);
  fs.writeFileSync(
    path.join(__dirname, 'icon-normalization-report.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('Saved normalization report to icon-normalization-report.json');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
