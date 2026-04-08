const API_ENDPOINT = 'https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne';

export const submitUserData = async (name, location) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        location: location.trim()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: `SUCCESS: Added ${name} from ${location}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Error: ${error.message}`
    };
  }
};