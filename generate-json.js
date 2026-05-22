const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/* ===================== */
/* PATHS */
/* ===================== */

const guitarsDir = path.join(__dirname, 'content/guitars');
const guitarsOutput = path.join(__dirname, 'data/guitars.json');

const reviewsDir = path.join(__dirname, 'content/reviews');
const reviewsOutput = path.join(__dirname, 'data/reviews.json');

/* ===================== */
/* BUILD */
/* ===================== */

function build() {

  /* ===================== */
  /* GUITARS (unchanged) */
  /* ===================== */

  const guitarFiles = fs.readdirSync(guitarsDir);

  const guitars = guitarFiles
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(guitarsDir, file);
      const fileContent = fs.readFileSync(fullPath, 'utf8');

      const { data } = matter(fileContent);

      // normalize images structure
      if (data.images) {
        data.images = data.images.map(item => {
          if (typeof item === 'string') return item;
          if (item.image) return item.image;
          return null;
        }).filter(Boolean);
      }

      return data;
    })
    .filter(Boolean);

  fs.writeFileSync(guitarsOutput, JSON.stringify(guitars, null, 2));
  console.log(`Generated ${guitars.length} guitars`);

  /* ===================== */
  /* REVIEWS (NEW) */
  /* ===================== */

  const reviewFiles = fs.readdirSync(reviewsDir);

  const reviews = reviewFiles
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(reviewsDir, file);
      const fileContent = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(fileContent);

      return {
        ...data,
        text: content.trim() // important (matches your frontend)
      };
    })
    .filter(Boolean);

  fs.writeFileSync(reviewsOutput, JSON.stringify(reviews, null, 2));
  console.log(`Generated ${reviews.length} reviews`);
 

/* ===================== */
/* COMMISSIONS (NEW) */
/* ===================== */

const commissionsDir = path.join(__dirname, 'content/commissions');
const commissionsOutput = path.join(__dirname, 'data/commissions.json');

const commissionFiles = fs.readdirSync(commissionsDir);

const commissions = commissionFiles
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const fullPath = path.join(commissionsDir, file);
    const fileContent = fs.readFileSync(fullPath, 'utf8');

    const { data } = matter(fileContent);

    // normalize images (same as guitars)
    if (data.images) {
      data.images = data.images.map(item => {
        if (typeof item === 'string') return item;
        if (item.image) return './' + item.image.replace(/^\.?\//, '');
        return null;
      }).filter(Boolean);
    }

    return data;
  })
  .filter(Boolean);

fs.writeFileSync(commissionsOutput, JSON.stringify(commissions, null, 2));

console.log(`Generated ${commissions.length} commissions`);

}

/* ===================== */
/* RUN */
/* ===================== */

build();