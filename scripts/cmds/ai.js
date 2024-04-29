const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "";
const _U = "";

module.exports = {
  config: {
    name: "ai",
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: { en: "dalle3 image generator" },
    longDescription: { en: "dalle3 is a image generator powdered by OpenAi" },
    category: "𝗔𝗜",
    guide: { en: "{prefix}dalle <search query>" }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    try {
      const res = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3?g.a000jAiTJOlfCg8Zh0hMjcH0_SwLRpbf9VUQskIpXMEtaBwdfq-O0iTKOSpj7DNL1zCLJ_3YkAACgYKATgSAQASFQHGX2MimEQ2KuUX8Tubz9MHIclxExoVAUF8yKrAiZcNqmxAbXKcAB8VIbWV0076_U=${_U}&g.a000jAiTJOlfCg8Zh0hMjcH0_SwLRpbf9VUQskIpXMEtaBwdfq-O0iTKOSpj7DNL1zCLJ_3YkAACgYKATgSAQASFQHGX2MimEQ2KuUX8Tubz9MHIclxExoVAUF8yKrAiZcNqmxAbXKcAB8VIbWV0076_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);
        return;
      }

      const imgData = [];

      for (let i = 0; i < Math.min(4, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage("Can't Full Fill this request ", event.threadID, event.messageID);
    }
  }
};
