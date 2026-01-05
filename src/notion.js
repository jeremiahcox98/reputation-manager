import { Client } from '@notionhq/client';
import config from './config.js';

const notion = new Client({
  auth: config.notion.apiKey,
});

/**
 * Formats a date to readable text format (e.g., "December 20, 2024")
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDateText(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats a date to ISO date string (YYYY-MM-DD) for Notion Date property
 * Uses local timezone instead of UTC to avoid date differences
 * @param {Date} date - Date object
 * @returns {string} ISO date string in local timezone
 */
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Finds a page in the Notion database by Day (title property)
 * @param {string} dayText - Date string in text format
 * @returns {Promise<string|null>} Page ID if found, null otherwise
 */
async function findPageByDay(dayText) {
  try {
    const response = await notion.databases.query({
      database_id: config.notion.databaseId,
      filter: {
        property: 'Day',
        title: {
          equals: dayText,
        },
      },
    });

    return response.results.length > 0 ? response.results[0].id : null;
  } catch (error) {
    console.error('Error finding page by day:', error.message);
    throw error;
  }
}

/**
 * Creates a new page in the Notion database
 * @param {Object} metrics - Metrics data to store
 * @returns {Promise<string>} Created page ID
 */
async function createPage(metrics) {
  try {
    const today = formatDateText(new Date());
    const todayISO = formatDateISO(new Date());
    
    const response = await notion.pages.create({
      parent: {
        database_id: config.notion.databaseId,
      },
      properties: {
        Day: {
          title: [
            {
              text: {
                content: today,
              },
            },
          ],
        },
        'Date': {
          date: {
            start: todayISO,
          },
        },
        'Google Reviews Count': {
          number: metrics.googleReviewsCount || null,
        },
        'Google Review Rating': {
          number: metrics.googleReviewRating || null,
        },
        'Instagram Followers Business': {
          number: metrics.instagramFollowersBusiness || null,
        },
        'Instagram Followers Personal': {
          number: metrics.instagramFollowersPersonal || null,
        },
        'Newsletter Subscribers': {
          number: metrics.newsletterSubscribers || null,
        },
        'Patients': {
          number: metrics.patients || null,
        },
      },
    });

    console.log(`Created new page in Notion for ${today}`);
    return response.id;
  } catch (error) {
    console.error('Error creating page:', error.message);
    if (error.body) {
      console.error('Error details:', JSON.stringify(error.body, null, 2));
    }
    throw error;
  }
}

/**
 * Updates an existing page in the Notion database
 * @param {string} pageId - Page ID to update
 * @param {Object} metrics - Metrics data to update
 */
async function updatePage(pageId, metrics) {
  try {
    const todayISO = formatDateISO(new Date());
    
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Date': {
          date: {
            start: todayISO,
          },
        },
        'Google Reviews Count': {
          number: metrics.googleReviewsCount || null,
        },
        'Google Review Rating': {
          number: metrics.googleReviewRating || null,
        },
        'Instagram Followers Business': {
          number: metrics.instagramFollowersBusiness || null,
        },
        'Instagram Followers Personal': {
          number: metrics.instagramFollowersPersonal || null,
        },
        'Newsletter Subscribers': {
          number: metrics.newsletterSubscribers || null,
        },
        'Patients': {
          number: metrics.patients || null,
        },
      },
    });

    const today = formatDateText(new Date());
    console.log(`Updated existing page in Notion for ${today}`);
  } catch (error) {
    console.error('Error updating page:', error.message);
    if (error.body) {
      console.error('Error details:', JSON.stringify(error.body, null, 2));
    }
    throw error;
  }
}

/**
 * Upserts metrics data to Notion database (creates new or updates existing)
 * @param {Object} metrics - Metrics data to store
 */
export async function upsertMetrics(metrics) {
  try {
    const today = formatDateText(new Date());
    const existingPageId = await findPageByDay(today);

    if (existingPageId) {
      await updatePage(existingPageId, metrics);
    } else {
      await createPage(metrics);
    }
  } catch (error) {
    console.error('Error upserting metrics:', error.message);
    throw error;
  }
}

