require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

// Map variant color names to base colors for the `colors` filter field
const colorMap = {
  'pink': 'pink', 'pink sparkle': 'pink', 'pink floral': 'pink', 'pink hearts': 'pink', 'pink unicorn': 'pink',
  'blush pink': 'pink', 'dusty pink': 'pink', 'pastel mix': 'pink',
  'blue': 'blue', 'light blue': 'blue', 'sky blue': 'blue', 'classic blue': 'blue', 'blue floral': 'blue',
  'blue shark': 'blue', 'blue dino': 'blue', 'blue stars': 'blue', 'blue waves': 'blue',
  'navy': 'navy', 'navy plaid': 'navy', 'navy/white': 'navy',
  'red': 'red', 'red plaid': 'red', 'red/blue': 'red',
  'green': 'green', 'forest green': 'green', 'green dino': 'green', 'green tropical': 'green',
  'yellow': 'yellow', 'yellow floral': 'yellow',
  'white': 'white', 'ivory': 'white', 'cream': 'white', 'gray/white': 'white',
  'black': 'black', 'black glow': 'black', 'black patent': 'black', 'black/gold': 'black',
  'black/navy/gray': 'black', 'black/purple': 'black', 'black/red': 'black',
  'gray': 'gray', 'gray plaid': 'gray', 'gray stripe': 'gray',
  'brown': 'brown', 'camel': 'brown', 'tan': 'brown', 'khaki': 'brown',
  'purple unicorn': 'purple', 'lavender': 'purple', 'black/purple': 'purple',
  'orange/black': 'orange',
  'gold': 'gold', 'gold glitter': 'gold',
  'silver': 'gray',
  'coral': 'pink', 'peach': 'pink',
  'mint': 'green', 'sage': 'green', 'olive': 'green',
  'rainbow': 'multi', 'multi': 'multi', 'assorted': 'multi',
  'floral': 'pink', 'floral/denim': 'blue', 'plaid': 'red',
  'stripe/solid': 'gray', 'nautical': 'navy',
  'cloud print': 'white', 'stars': 'blue', 'star theme': 'blue',
  'animal print': 'brown', 'animals': 'brown', 'safari': 'brown', 'safari print': 'brown',
  'woodland': 'green', 'ocean friends': 'blue', 'rocket ship': 'blue',
  'bear theme': 'brown', 'dino theme': 'green',
  'dark wash': 'blue', 'light wash': 'blue', 'medium wash': 'blue',
};

// Infer gender from tags
function inferGender(tags, name) {
  const t = (tags || []).map(s => s.toLowerCase());
  const n = (name || '').toLowerCase();
  if (t.includes('girl') || n.includes('girl')) return 'girl';
  if (t.includes('boy') || n.includes('boy')) return 'boy';
  return 'unisex';
}

// Infer age group from tags and name
function inferAgeGroup(tags, name) {
  const t = (tags || []).map(s => s.toLowerCase());
  const n = (name || '').toLowerCase();
  if (t.includes('baby') || n.includes('baby') || n.includes('newborn') || n.includes('infant') || n.includes('0-18') || n.includes('months')) {
    return 'baby-0-18m';
  }
  if (n.includes('toddler') || t.includes('toddler') || n.includes('2t') || n.includes('3t') || n.includes('4t') || n.includes('5t')) {
    const gender = inferGender(tags, name);
    return gender === 'boy' ? 'toddler-boys-2-5' : 'toddler-girls-2-5';
  }
  const gender = inferGender(tags, name);
  if (gender === 'girl') return 'girls-6-16';
  if (gender === 'boy') return 'boys-6-16';
  return null;
}

// Infer product type from name
function inferProductType(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('costume') || n.includes('superhero') || n.includes('fairy')) return 'costumes';
  if (n.includes('dress') || n.includes('gown')) return 'dresses';
  if (n.includes('sock') || n.includes('tights')) return 'socks';
  if (n.includes('short')) return 'shorts';
  if (n.includes('t-shirt') || n.includes('tee') || n.includes('graphic tee')) return 't-shirts';
  if (n.includes('polo') || n.includes('top') || n.includes('shirt') || n.includes('blouse') || n.includes('hoodie') || n.includes('sweater') || n.includes('cardigan') || n.includes('jacket') || n.includes('vest') || n.includes('coat')) return 'tops';
  if (n.includes('pant') || n.includes('jogger') || n.includes('sweatpant') || n.includes('jean') || n.includes('legging') || n.includes('skirt') || n.includes('bottom') || n.includes('chino')) return 'bottoms';
  if (n.includes('shoe') || n.includes('sneaker') || n.includes('boot') || n.includes('sandal') || n.includes('slide') || n.includes('slipper') || n.includes('bootie')) return 'shoes';
  if (n.includes('pajama') || n.includes('pj') || n.includes('sleep') || n.includes('nightwear')) return 'pajamas';
  if (n.includes('set') || n.includes('outfit') || n.includes('romper') || n.includes('swim') || n.includes('onesie')) return 'sets';
  if (n.includes('hat') || n.includes('bow') || n.includes('headband') || n.includes('bib') || n.includes('blanket')) return 'accessories';
  return 'tops';
}

// Extract base colors from variants
function extractColors(variants) {
  const baseColors = new Set();
  (variants || []).forEach(v => {
    const variantColor = (v.color || '').toLowerCase();
    const mapped = colorMap[variantColor];
    if (mapped) {
      baseColors.add(mapped);
    } else {
      // Try partial match
      for (const [key, val] of Object.entries(colorMap)) {
        if (variantColor.includes(key) || key.includes(variantColor)) {
          baseColors.add(val);
          break;
        }
      }
    }
  });
  return [...baseColors];
}

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const products = await Product.find({});
  console.log(`Found ${products.length} products to update.`);

  let updated = 0;
  for (const p of products) {
    const gender = inferGender(p.tags, p.name);
    const ageGroup = inferAgeGroup(p.tags, p.name);
    const productType = inferProductType(p.name);
    const colors = extractColors(p.variants);

    const updateData = {};
    if (gender !== 'unisex' || !p.gender || p.gender === 'unisex') updateData.gender = gender;
    if (ageGroup) updateData.ageGroup = ageGroup;
    if (productType) updateData.productType = productType;
    if (colors.length > 0) updateData.colors = colors;

    if (Object.keys(updateData).length > 0) {
      await Product.updateOne({ _id: p._id }, { $set: updateData });
      updated++;
      console.log(`  ✅ ${p.name} → gender:${updateData.gender || '-'}, age:${updateData.ageGroup || '-'}, type:${updateData.productType || '-'}, colors:[${(updateData.colors || []).join(',')}]`);
    }
  }

  console.log(`\nDone! Updated ${updated}/${products.length} products.`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
