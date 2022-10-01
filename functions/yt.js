const axios = require('axios');

exports.handler = async (event, context, callback) => {
  let channel = event.queryStringParameters.channel
  let pageUrl = "https://www.youtube.com/c/" + channel + "/live"
  let streamingUrl = ''
  let rawData = ''

    const response = await axios.get(pageUrl);
    rawData = response.data;

    streamingUrl = rawData.match(/(?<=hlsManifestUrl":").*\.m3u8/g);
	//let hasMatch = rawData.includes(".m3u8");
    console.log(`request ${event.queryStringParameters.channel}\nreturn ${streamingUrl}`);
	  return {
		statusCode: 302,
		headers: {
		  location: streamingUrl,
		},
		body: `Go to ${streamingUrl}`,
	  };
};
