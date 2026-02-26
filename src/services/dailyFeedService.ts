import axios from 'axios';

export interface FeedItem {
  id: string;
  type: 'nasa' | 'dog';
  title: string;
  url: string; // Image URL
  explanation: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
}

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

if (!NASA_API_KEY) {
  console.warn('VITE_NASA_API_KEY is not defined. NASA features will use the rate-limited "DEMO_KEY". Get your own at https://api.nasa.gov/');
}

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

const DOG_IMAGE_URL = 'https://dog.ceo/api/breeds/image/random';
const DOG_FACT_URL = 'https://dogapi.dog/api/v2/facts';

// Shared Axios config for consistency
const AXIOS_CONFIG = {
  timeout: 10000, // 10 seconds
  maxContentLength: 5 * 1024 * 1024, // 5MB
  headers: {
    'Accept': 'application/json'
  }
};

export const getNASAData = async (): Promise<FeedItem> => {
  try {
    const response = await axios.get(NASA_APOD_URL, {
      ...AXIOS_CONFIG,
      params: {
        api_key: NASA_API_KEY || 'DEMO_KEY',
        thumbs: 'True'
      }
    });
    const data = response.data;

    // Handle video case: use thumbnail if available, otherwise fallback or use url if it's an image
    let imageUrl = data.url;
    if (data.media_type === 'video' && data.thumbnail_url) {
      imageUrl = data.thumbnail_url;
    } else if (data.media_type === 'video') {
       // Fallback for video without thumbnail (unlikely with thumbs=True, but safe)
       imageUrl = '';
    }

    return {
      id: `nasa-${data.date}`,
      type: 'nasa',
      title: data.title,
      url: imageUrl,
      explanation: data.explanation,
      mediaType: data.media_type,
      thumbnailUrl: data.thumbnail_url
    };
  } catch (error) {
    // Log sanitized error to avoid leaking the API key potentially contained in the full error or URL
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      console.error(`Error fetching NASA data${status ? ` [${status}]` : ''}: ${error.message}`);
    } else {
      console.error('Error fetching NASA data:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Return fallback or rethrow. For UI, returning a safe fallback is better.
    return {
      id: 'nasa-fallback',
      type: 'nasa',
      title: 'Space Exploration',
      url: 'https://apod.nasa.gov/apod/image/2301/NGC2264_Cone_Fox_1024.jpg', // A nice default space image
      explanation: 'NASA Astronomy Picture of the Day is currently unavailable. Enjoy this classic view of the Cone Nebula.',
      mediaType: 'image'
    };
  }
};

export const getDogData = async (): Promise<FeedItem> => {
  try {
    // Fetch image and fact in parallel
    const [imageRes, factRes] = await Promise.all([
      axios.get(DOG_IMAGE_URL, AXIOS_CONFIG),
      axios.get(DOG_FACT_URL, AXIOS_CONFIG)
    ]);

    const imageData = imageRes.data;
    const factData = factRes.data;

    const imageUrl = imageData.message;
    const factText = factData.data?.[0]?.attributes?.body || 'Dogs are amazing companions!';

    return {
      id: `dog-${Date.now()}`,
      type: 'dog',
      title: 'Dog Fact',
      url: imageUrl,
      explanation: factText,
      mediaType: 'image'
    };
  } catch (error) {
    // Log only the error message to avoid leaking potentially sensitive details (though dog APIs are public)
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching Dog data: ${error.message}`);
    } else {
      console.error('Error fetching Dog data:', error);
    }

    return {
      id: 'dog-fallback',
      type: 'dog',
      title: 'Dog Fact',
      url: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_10.jpg', // Default cute dog
      explanation: 'Dogs have a sense of time. It\'s been proven that they know the difference between an hour and five hours. If conditioned to, they can predict future events, such as regular walk times.',
      mediaType: 'image'
    };
  }
};
