const axios = require('axios');

this.config = {
  name: 'jea',
  version: '1.0',
  author: {
    name: '',
    contacts: 'https://liaspark.chatbotcommunity.ltd/profile@lanceajiro'
  },
  role: 0,
  category: 'Ai-Chat',
  shortDescription: `Your ai personal girlfriend`,
  longDescription: `Your ai personal girlfriend`,
  guide: '{pn}jea-mean [query]'
};

this.onStart = async function({ api }) {
  // Do nothing for now
};

module.exports = {
  config: this.config,
  onStart: this.onStart,
  start: async function({ api, event, args }) {
    try {
      const query = args.join(" ") || "hello";

      if (query) {
        api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
        const processingMessage = await api.sendMessage(
          `Asking Jea - Mean. Please wait a moment...`,
          event.threadID
        );

        const apiUrl = `https://liaspark.chatbotcommunity.ltd/@lanceajiro/api/jea-mean?key=j86bwkwo-8hako-12C&query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
          const trimmedMessage = response.data.message.trim();
          api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
          await api.sendMessage({ body: trimmedMessage }, event.threadID, event.messageID);

          console.log(`Sent Jea - Mean's response to the user`);
        } else {
          throw new Error(`Invalid or missing response from Jea - Mean API`);
        }

        await api.unsendMessage(processingMessage.messageID);
      }
    } catch (error) {
      console.error(`❌ | Failed to get Jea - Mean's response: ${error.message}`);
      const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
      api.sendMessage(errorMessage, event.threadID);
    }
  },
};
