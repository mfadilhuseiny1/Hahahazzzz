'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Analyze water quality',
      label: 'parameters for optimal fish growth',
      action: 'Analyze water quality parameters for optimal fish growth in aquaculture systems',
    },
    {
      title: 'Design IoT sensor network',
      label: 'for real-time monitoring',
      action: 'Design an IoT sensor network for real-time monitoring of aquaculture systems',
    },
    {
      title: 'Calculate feed conversion',
      label: 'ratio and growth metrics',
      action: 'Calculate feed conversion ratio and growth metrics for aquaculture performance analysis',
    },
    {
      title: 'Predict disease outbreaks',
      label: 'using environmental data',
      action: 'Predict disease outbreaks using environmental data and machine learning in aquaculture',
    },
    {
      title: 'Optimize stocking density',
      label: 'for sustainable production',
      action: 'Optimize stocking density for sustainable aquaculture production and fish welfare',
    },
    {
      title: 'Monitor dissolved oxygen',
      label: 'levels automatically',
      action: 'Monitor dissolved oxygen levels automatically in aquaculture ponds and tanks',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
