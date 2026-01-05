import dotenv from 'dotenv';

dotenv.config();

const config = {
  hasData: {
    apiKey: process.env.HASDATA_API_KEY,
    endpoints: {
      googleReviews: 'https://api.hasdata.com/scrape/google-maps/reviews',
      instagramProfile: 'https://api.hasdata.com/scrape/instagram/profile',
    },
  },
  google: {
    placeId: process.env.GOOGLE_PLACE_ID,
  },
  instagram: {
    businessHandle: process.env.INSTAGRAM_BUSINESS_HANDLE,
    personalHandle: process.env.INSTAGRAM_PERSONAL_HANDLE,
  },
  goHighLevel: {
    clientId: process.env.GOHIGHLEVEL_CLIENT_ID,
    clientSecret: process.env.GOHIGHLEVEL_CLIENT_SECRET,
    locationId: process.env.GOHIGHLEVEL_LOCATION_ID,
  },
  notion: {
    apiKey: process.env.NOTION_API_KEY,
    databaseId: process.env.NOTION_DATABASE_ID,
  },
};

// Validate required configuration
const requiredEnvVars = [
  'HASDATA_API_KEY',
  'GOOGLE_PLACE_ID',
  'INSTAGRAM_BUSINESS_HANDLE',
  'INSTAGRAM_PERSONAL_HANDLE',
  'NOTION_API_KEY',
  'NOTION_DATABASE_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`  - ${varName}`));
  process.exit(1);
}

export default config;

