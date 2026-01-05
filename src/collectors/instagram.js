import axios from 'axios';
import config from '../config.js';

/**
 * Collects Instagram follower count for a specific handle
 * @param {string} handle - Instagram handle (without @)
 * @returns {Promise<number>} Follower count
 */
async function getInstagramFollowers(handle) {
  try {
    const options = {
      method: 'GET',
      url: config.hasData.endpoints.instagramProfile,
      params: {
        handle: handle,
      },
      headers: {
        'x-api-key': config.hasData.apiKey,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.request(options);

    if (typeof data.followersCount !== 'number') {
      throw new Error('Invalid response structure from HasData API');
    }

    return data.followersCount;
  } catch (error) {
    console.error(`Error collecting Instagram followers for ${handle}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Collects Instagram follower counts for both business and personal accounts
 * @returns {Promise<{business: number, personal: number}>}
 */
/**
 * Helper function to delay execution
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Collects Instagram follower counts for both business and personal accounts
 * @returns {Promise<{business: number, personal: number}>}
 */
export async function collectInstagramFollowers() {
  try {
    console.log('Collecting Instagram followers...');
    
    // Collect business followers first
    const businessFollowers = await getInstagramFollowers(config.instagram.businessHandle);
    console.log(`Instagram Business (@${config.instagram.businessHandle}): ${businessFollowers} followers`);
    
    // Wait 2 seconds before making the second request to avoid rate limits
    await delay(2000);
    
    // Collect personal followers
    const personalFollowers = await getInstagramFollowers(config.instagram.personalHandle);
    console.log(`Instagram Personal (@${config.instagram.personalHandle}): ${personalFollowers} followers`);

    return {
      business: businessFollowers,
      personal: personalFollowers,
    };
  } catch (error) {
    console.error('Error collecting Instagram followers:', error.message);
    throw error;
  }
}

