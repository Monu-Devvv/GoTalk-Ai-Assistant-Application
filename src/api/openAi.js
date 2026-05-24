import axios from 'axios';
import { apikey } from '../constants';

// ── Bug 1: "conetent-type" typo fixed → "content-type"
const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apikey,
    'content-type': 'application/json',
  },
});

// ── Bug 2: wrong endpoint "completion" → "completions"
const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndpoint   = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatGptEndpoint, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          // ── Bug 3: "roles" typo fixed → "role"
          role: 'user',
          // ── Bug 4: "promt" typo fixed → "prompt"
          content: `Does this message want to generate an AI picture, image, art or anything similar? "${prompt}". Simply answer with yes or no.`,
        },
      ],
    });

    let isArt = res.data?.choices[0]?.message?.content;
    if (isArt?.toLowerCase().includes('yes')) {
      console.log('dalle api call');
      return dalleApiCall(prompt, messages || []);
    } else {
      console.log('chatgpt api call');
      return chatgptApiCall(prompt, messages || []);
    }
  } catch (error) {
    console.log('apiCall error:', error);
    return Promise.resolve({ success: false, msg: error.message });
  }
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    // ── Bug 5: messages array was incomplete (message: ) — fixed
    const newMessages = [...messages, { role: 'user', content: prompt }];

    const res = await client.post(chatGptEndpoint, {
      model: 'gpt-3.5-turbo',
      messages: newMessages,
    });

    let answer = res.data?.choices[0]?.message?.content;
    newMessages.push({ role: 'assistant', content: answer.trim() });
    return Promise.resolve({ success: true, data: newMessages });
  } catch (error) {
    // ── Bug 6: "onsole.log" and "err" typo fixed
    console.log('chatgptApiCall error:', error);
    return Promise.resolve({ success: false, msg: error.message });
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    // ── Bug 7: "client.post(dalleApiCall, ...)" — passing function instead of URL, fixed
    const res = await client.post(dalleEndpoint, {
      prompt,
      n: 1,
      // ── Bug 8: "512*512" is wrong format — fixed to "512x512"
      size: '512x512',
    });

    // ── Bug 9: "let url = res?.data?.data[0] ? url" — broken ternary fixed
    let url = res?.data?.data[0]?.url;
    console.log('got url of image:', url);

    // ── Bug 10: "message.push" — wrong variable name, fixed to "messages"
    const newMessages = [...messages];
    newMessages.push({ role: 'assistant', content: url });
    return Promise.resolve({ success: true, data: newMessages });
  } catch (error) {
    console.log('dalleApiCall error:', error);
    return Promise.resolve({ success: false, msg: error.message });
  }
};
