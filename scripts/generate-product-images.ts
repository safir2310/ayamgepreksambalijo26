import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const products = [
  {
    name: 'Ayam Geprek Sambal Ijo',
    prompt: 'Delicious Indonesian fried chicken with green chili sauce (sambal ijo), garnish with fresh green chilies, professional food photography, white plate, appetizing, high quality',
    filename: 'ayam-geprek-sambal-ijo.png'
  },
  {
    name: 'Ayam Geprek Sambal Merah',
    prompt: 'Delicious Indonesian fried chicken with red chili sauce (sambal merah), garnish with red chilies, professional food photography, white plate, appetizing, high quality',
    filename: 'ayam-geprek-sambal-merah.png'
  },
  {
    name: 'Ayam Geprek Original',
    prompt: 'Crispy Indonesian fried chicken (ayam geprek), lightly crushed, professional food photography, white plate, appetizing, high quality',
    filename: 'ayam-geprek-original.png'
  },
  {
    name: 'Nasi Putih',
    prompt: 'Steamed white rice in a bowl, professional food photography, clean presentation, high quality',
    filename: 'nasi-putih.png'
  },
  {
    name: 'Es Teh Manis',
    prompt: 'Iced sweet tea in a glass with ice cubes and lemon slice, refreshing, professional beverage photography, clear glass, high quality',
    filename: 'es-teh-manis.png'
  },
  {
    name: 'Es Jeruk',
    prompt: 'Fresh orange juice with ice cubes in a glass, refreshing citrus drink, professional beverage photography, high quality',
    filename: 'es-jeruk.png'
  },
  {
    name: 'Ayam Bakar',
    prompt: 'Grilled chicken (ayam bakar) with sweet soy sauce glaze, garnish with cucumber and tomato, professional food photography, appetizing, high quality',
    filename: 'ayam-bakar.png'
  },
  {
    name: 'Tahu Tempe Goreng',
    prompt: 'Fried tofu (tahu goreng) and fried tempeh, crispy golden brown, traditional Indonesian food, professional food photography, high quality',
    filename: 'tahu-tempe-goreng.png'
  }
];

async function generateImages() {
  const zai = await ZAI.create();
  const outputDir = path.join(process.cwd(), 'public', 'products');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎨 Generating product images for AYAM GEPREK SAMBAL IJO...\n');

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const outputPath = path.join(outputDir, product.filename);

    try {
      console.log(`[${i + 1}/${products.length}] Generating: ${product.name}`);

      const response = await zai.images.generations.create({
        prompt: product.prompt,
        size: '1024x1024'
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');

      fs.writeFileSync(outputPath, buffer);

      console.log(`✓ Saved to: /public/products/${product.filename}\n`);
    } catch (error) {
      console.error(`✗ Failed to generate ${product.name}:`, error.message, '\n');
    }
  }

  console.log('✅ Image generation complete!');
}

generateImages().catch(console.error);
