import { HighLevel } from '@gohighlevel/api-client';
import axios from 'axios';
import config from '../config.js';

// Initialize HighLevel client (only if OAuth credentials are provided)
let highLevel = null;
if (config.goHighLevel.clientId && config.goHighLevel.clientSecret) {
  highLevel = new HighLevel({
    clientId: config.goHighLevel.clientId,
    clientSecret: config.goHighLevel.clientSecret,
  });
}

/**
 * Collects total contact count from GoHighLevel using Contacts Search API with PIT token
 * @param {string} apiToken - Private Integration Token
 * @param {string} locationId - Location ID
 * @param {Array} filters - Optional filters array
 * @returns {Promise<number>} Total contact count
 */
async function getContactCountWithPIT(apiToken, locationId, filters = null) {
  try {
    // Build request body
    const requestBody = {
      locationId: locationId,
      pageLimit: 1, // We only need the metadata to get total count
      page: 1,
    };

    // Add filters if provided
    if (filters && filters.length > 0) {
      requestBody.filters = filters;
    }

    // Use the new Contacts Search API endpoint (POST /contacts/search)
    const response = await axios.post(
      `https://services.leadconnectorhq.com/contacts/search`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28', // Required for PIT tokens
        },
      }
    );

    // Response structure: { contacts: [...], total: number }
    const contactCount = response.data.total || 0;
    return contactCount;
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      console.error('GoHighLevel API Error Details:');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Request URL:', error.config?.url);
    }
    throw new Error(`PIT API error: ${error.message}`);
  }
}

/**
 * Collects contact count filtered by tag using Contacts Search API with PIT token
 * @param {string} apiToken - Private Integration Token
 * @param {string} locationId - Location ID
 * @param {string} tag - Tag to filter by
 * @returns {Promise<number>} Contact count with the specified tag
 */
async function getContactCountByTagWithPIT(apiToken, locationId, tag) {
  try {
    // Use the Contacts Search API endpoint with tag filter
    const response = await axios.post(
      `https://services.leadconnectorhq.com/contacts/search`,
      {
        locationId: locationId,
        pageLimit: 1, // We only need the metadata to get total count
        page: 1,
        filters: [
          {
            field: 'tags',
            operator: 'eq',
            value: tag,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28', // Required for PIT tokens
        },
      }
    );

    // Response structure: { contacts: [...], total: number }
    const contactCount = response.data.total || 0;
    return contactCount;
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      console.error('GoHighLevel API Error Details (Tag Filter):');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error(`PIT API error (tag filter): ${error.message}`);
  }
}

/**
 * Collects newsletter subscriber count (contacts with email) from GoHighLevel
 * @returns {Promise<number>} Newsletter subscriber count (contacts with email)
 */
export async function collectNewsletterSubscribers() {
  try {
    // Check if we have OAuth credentials (SDK) or PIT token (REST API)
    const hasOAuth = config.goHighLevel.clientId && config.goHighLevel.clientSecret;
    const hasPIT = process.env.GOHIGHLEVEL_API_TOKEN;
    
    if (!hasOAuth && !hasPIT) {
      console.warn('GoHighLevel credentials not configured, skipping newsletter subscriber collection');
      return 0;
    }

    if (!config.goHighLevel.locationId) {
      console.warn('GoHighLevel location ID not configured, skipping newsletter subscriber collection');
      return 0;
    }

    // Filter for contacts that have an email (exists operator)
    const emailFilter = [
      {
        field: 'email',
        operator: 'exists',
      },
    ];

    let subscriberCount = 0;

    // Try SDK first (OAuth) - uses searchContactsAdvanced which uses the new search endpoint
    if (hasOAuth && highLevel) {
      try {
        const response = await highLevel.contacts.searchContactsAdvanced({
          locationId: config.goHighLevel.locationId,
          pageLimit: 1, // We only need the metadata, not the actual contacts
          filters: emailFilter,
        });

        // SDK response should have total in the response
        subscriberCount = response.total || 0;
      } catch (sdkError) {
        console.warn('SDK method failed, trying PIT token fallback...');
        // Fall back to PIT if SDK fails
        if (hasPIT) {
          subscriberCount = await getContactCountWithPIT(
            process.env.GOHIGHLEVEL_API_TOKEN,
            config.goHighLevel.locationId,
            emailFilter
          );
        } else {
          throw sdkError;
        }
      }
    } else if (hasPIT) {
      // Use PIT token directly with email filter
      subscriberCount = await getContactCountWithPIT(
        process.env.GOHIGHLEVEL_API_TOKEN,
        config.goHighLevel.locationId,
        emailFilter
      );
    }

    console.log(`GoHighLevel Newsletter Subscribers: ${subscriberCount} contacts with email`);

    return subscriberCount;
  } catch (error) {
    console.error('Error collecting GoHighLevel newsletter subscribers:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // Return 0 instead of throwing to allow script to continue
    console.warn('Continuing without GoHighLevel newsletter subscriber data');
    return 0;
  }
}

/**
 * Collects patient count (contacts with "patient" tag) from GoHighLevel
 * @returns {Promise<number>} Patient count
 */
export async function collectPatientCount() {
  try {
    // Check if we have OAuth credentials (SDK) or PIT token (REST API)
    const hasOAuth = config.goHighLevel.clientId && config.goHighLevel.clientSecret;
    const hasPIT = process.env.GOHIGHLEVEL_API_TOKEN;
    
    if (!hasOAuth && !hasPIT) {
      console.warn('GoHighLevel credentials not configured, skipping patient count collection');
      return 0;
    }

    if (!config.goHighLevel.locationId) {
      console.warn('GoHighLevel location ID not configured, skipping patient count collection');
      return 0;
    }

    let patientCount = 0;

    // Try SDK first (OAuth) - uses searchContactsAdvanced with filters
    if (hasOAuth && highLevel) {
      try {
        const response = await highLevel.contacts.searchContactsAdvanced({
          locationId: config.goHighLevel.locationId,
          pageLimit: 1, // We only need the metadata, not the actual contacts
          filters: [
            {
              field: 'tags',
              operator: 'eq',
              value: 'patient',
            },
          ],
        });

        // SDK response should have total in the response
        patientCount = response.total || 0;
      } catch (sdkError) {
        console.warn('SDK method failed for patient count, trying PIT token fallback...');
        // Fall back to PIT if SDK fails
        if (hasPIT) {
          patientCount = await getContactCountByTagWithPIT(
            process.env.GOHIGHLEVEL_API_TOKEN,
            config.goHighLevel.locationId,
            'patient'
          );
        } else {
          throw sdkError;
        }
      }
    } else if (hasPIT) {
      // Use PIT token directly
      patientCount = await getContactCountByTagWithPIT(
        process.env.GOHIGHLEVEL_API_TOKEN,
        config.goHighLevel.locationId,
        'patient'
      );
    }

    console.log(`GoHighLevel Patients: ${patientCount} patients`);

    return patientCount;
  } catch (error) {
    console.error('Error collecting GoHighLevel patient count:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // Return 0 instead of throwing to allow script to continue
    console.warn('Continuing without GoHighLevel patient data');
    return 0;
  }
}

