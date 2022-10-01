const axios = require('axios');

const main = async () => {
	const data = getYoutubeStream('WorkpointOfficial')
	console.log("M3U8 URL: " + data);
};

main();

async function getYoutubeStream(id) {
  console.log("channel id: " + id)
  let url = "https://www.youtube.com/c/" + id + "/live"
  let stream = "";
  console.log("live url: " + url);
  try {
    const response = await axios.get(url);
    body = response.data;
	const = body.match(/(?<=hlsManifestUrl":").*\.m3u8/g);
	stream = url;
	body = response.data;
  } catch (error) {
    console.log(error);
    return { statusCode: 404, body: `Cannot get data for "${url}"` };
  }
  console.log("M3U8 URL: " + stream);
  return stream;
}
