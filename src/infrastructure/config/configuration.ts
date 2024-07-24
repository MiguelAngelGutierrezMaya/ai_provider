export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  ai_providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      apiUrl: process.env.OPENAI_API_URL || '',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      apiUrl: process.env.ANTHROPIC_API_URL || '',
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY || '',
    },
    huggingFace: {
      apiKey: process.env.HUGGINGFACE_API_KEY || '',
    },
  },
});
