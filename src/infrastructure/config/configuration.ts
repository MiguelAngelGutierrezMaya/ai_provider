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
  },
});
