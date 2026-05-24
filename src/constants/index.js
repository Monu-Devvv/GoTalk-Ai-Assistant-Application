// ⚠️  IMPORTANT: Never commit your real API key to git!
// Put your real key here for local dev only.
// Add constants/index.js to .gitignore if it contains your key.
export const apikey = 'YOUR_OPENAI_API_KEY_HERE';

export const dummyMessages = [
  {
    role: 'user',
    content: 'How are you?',
  },
  {
    role: 'assistant',
    content: "I'm fine! How may I help you today?",
  },
  {
    role: 'user',
    content: 'Create an image of a dog playing with a cat.',
  },
  {
    role: 'assistant',
    content: 'Sure! Generating that image for you now...',
  },
];
