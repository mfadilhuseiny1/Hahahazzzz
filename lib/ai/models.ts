// @ts-nocheck

import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { google } from '@ai-sdk/google';


import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';


export const DEFAULT_CHAT_MODEL: string = 'chat-model-data';


export const myProvider = customProvider({
  languageModels: {
    'chat-model-data': openai('gpt-4o'),
    // 'chat-model-data': wrapLanguageModel({
    //   model: fireworks('accounts/fireworks/models/llama4-maverick-instruct-basic'),
    //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
    // }),
    'chat-model-large': openai('gpt-4o'),
    'chat-model-reasoning': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/deepseek-r1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'chat-model-aqua': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/llama4-maverick-instruct-basic'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    // 'chat-model-aqua': wrapLanguageModel({
    //   model: fireworks('accounts/fireworks/models/llama4-scout-instruct-basic'),
    //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
    // }),
  // 'chat-model-searcha': google('gemini-1.5-pro'),
  'chat-model-onl': google('gemini-2.5-pro', {
    useSearchGrounding: true,
  }),
    // 'chat-model-search': google('gemini-1.5-pro'),


    // 'chat-model-reasoning': wrapLanguageModel({
    //   model: perplexity('sonar-pro'),
    //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
    // }),
    // 'chat-model-aqua': fireworks('accounts/fireworks/models/llama4-maverick-instruct-basic'),
    
    'title-model': openai('gpt-4-turbo'),
    'block-model': openai('gpt-4o-mini'),
  },
  imageModels: {
    'small-model': openai.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-data',
    name: 'Chat with Data',
    description: 'Conversational interface for exploring and querying your database.',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-aqua',
    name: 'Aqua model',
    description: 'Large model for Aquaculture',
  },
  {
    id: 'chat-model-onl',
    name: 'Web Search (Large Model)',
    description: 'A powerful language model with integrated real-time web search capabilities.',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning Pro',
    description: 'Uses advanced reasoning',
  },
];
