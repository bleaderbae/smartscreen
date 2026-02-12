export interface FeedItem {
  id: string;
  type: 'nasa' | 'dog';
  title: string;
  url: string; // Image URL
  explanation: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
}

const NASA_API_KEY = 'DEMO_KEY';
const NASA_APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&thumbs=True`;

const DOG_IMAGE_URL = 'https://dog.ceo/api/breeds/image/random';
const DOG_FACT_URL = 'https://dogapi.dog/api/v2/facts';

export const getNASAData = async (): Promise<FeedItem> => {
  try {
    const response = await fetch(NASA_APOD_URL);
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.statusText}`);
    }
    const data = await response.json();

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
    console.error('Error fetching NASA data:', error);
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
      fetch(DOG_IMAGE_URL),
      fetch(DOG_FACT_URL)
    ]);

    if (!imageRes.ok || !factRes.ok) {
      throw new Error('Failed to fetch dog data');
    }

    const imageData = await imageRes.json();
    const factData = await factRes.json();

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
    console.error('Error fetching Dog data:', error);
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
