const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const frontendRoot = path.resolve(__dirname, '..');
const imagesDirectory = path.join(frontendRoot, 'public', 'images');
const outputDirectory = path.join(imagesDirectory, 'optimized');
const manifestPath = path.join(frontendRoot, 'src', 'generated', 'gift-images.json');
const widths = [480, 960, 1440];

async function main() {
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });

  const filenames = (await fs.readdir(imagesDirectory))
    .filter(filename => /\.(jpe?g|png)$/i.test(filename))
    .sort();
  const manifest = {};
  let originalBytes = 0;
  let smallImageBytes = 0;
  let largeImageBytes = 0;

  // Process one photo at a time to limit memory use with large source images.
  for (const filename of filenames) {
    const source = path.join(imagesDirectory, filename);
    const metadata = await sharp(source).metadata();
    const rotated = [5, 6, 7, 8].includes(metadata.orientation);
    const sourceWidth = rotated ? metadata.height : metadata.width;
    const sourceHeight = rotated ? metadata.width : metadata.height;
    const targetWidths = [...new Set(widths.map(width => Math.min(width, sourceWidth)))];
    const sources = [];
    const sizes = [];

    for (const width of targetWidths) {
      const outputName = `${filename}-${width}.webp`;
      const info = await sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(path.join(outputDirectory, outputName));

      sources.push(`/images/optimized/${outputName} ${info.width}w`);
      sizes.push(info.size);
    }

    manifest[`/images/${filename}`] = {
      width: sourceWidth,
      height: sourceHeight,
      srcSet: sources.join(', '),
    };
    originalBytes += (await fs.stat(source)).size;
    smallImageBytes += sizes[0];
    largeImageBytes += sizes[sizes.length - 1];
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({
    images: filenames.length,
    originalBytes,
    smallImageBytes,
    largeImageBytes,
    smallestSizeReductionPercent: Number((100 * (1 - smallImageBytes / originalBytes)).toFixed(2)),
  }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
