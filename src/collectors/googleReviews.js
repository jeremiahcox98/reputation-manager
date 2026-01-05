import axios from 'axios';
import config from '../config.js';

/**
 * Collects Google Reviews data using HasData API
 * @returns {Promise<{reviewCount: number, rating: number}>}
 */
export async function collectGoogleReviews() {
  try {
    const options = {
      method: 'GET',
      url: config.hasData.endpoints.googleReviews,
      params: {
        placeId: config.google.placeId,
      },
      headers: {
        'x-api-key': config.hasData.apiKey,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.request(options);

    if (!data.placeInfo) {
      throw new Error('Invalid response structure from HasData API');
    }

    const reviewCount = data.placeInfo.reviews || 0;
    const rating = data.placeInfo.rating || 0;

    console.log(`Google Reviews: ${reviewCount} reviews, ${rating} rating`);

    return {
      reviewCount,
      rating,
    };
  } catch (error) {
    console.error('Error collecting Google Reviews:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

