const fetch = require("node-fetch");

const API_ENDPOINT ='https://www.youtube.com/channel/UCt4t-jeY85JegMlZ-E5UWtA/live';

exports.handler = async (event, context) => {
  try {
    const response = await fetch(API_ENDPOINT);
	const text = await response.text()
	const stream = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g)
    return { statusCode: 302, body: stream };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};