import { collectGoogleReviews } from './src/collectors/googleReviews.js';
import { collectInstagramFollowers } from './src/collectors/instagram.js';
import { collectNewsletterSubscribers, collectPatientCount } from './src/collectors/gohighlevel.js';
import { upsertMetrics } from './src/notion.js';

/**
 * Main function to collect all metrics and store in Notion
 */
async function main() {
  console.log('Starting daily metrics collection...');
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const metrics = {
    googleReviewsCount: null,
    googleReviewRating: null,
    instagramFollowersBusiness: null,
    instagramFollowersPersonal: null,
    newsletterSubscribers: null,
    patients: null,
  };

  // Collect Google Reviews
  try {
    const googleData = await collectGoogleReviews();
    metrics.googleReviewsCount = googleData.reviewCount;
    metrics.googleReviewRating = googleData.rating;
  } catch (error) {
    console.error('Failed to collect Google Reviews, continuing...');
  }

  // Collect Instagram Followers
  try {
    const instagramData = await collectInstagramFollowers();
    metrics.instagramFollowersBusiness = instagramData.business;
    metrics.instagramFollowersPersonal = instagramData.personal;
  } catch (error) {
    console.error('Failed to collect Instagram followers, continuing...');
  }

  // Collect Newsletter Subscribers
  try {
    metrics.newsletterSubscribers = await collectNewsletterSubscribers();
  } catch (error) {
    console.error('Failed to collect newsletter subscribers, continuing...');
  }

  // Collect Patient Count (contacts with "patient" tag)
  try {
    metrics.patients = await collectPatientCount();
  } catch (error) {
    console.error('Failed to collect patient count, continuing...');
  }

  // Store metrics in Notion
  try {
    await upsertMetrics(metrics);
    console.log('\n✅ Successfully stored metrics in Notion');
  } catch (error) {
    console.error('\n❌ Failed to store metrics in Notion:', error.message);
    process.exit(1);
  }

  console.log('\nDaily metrics collection completed!');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

