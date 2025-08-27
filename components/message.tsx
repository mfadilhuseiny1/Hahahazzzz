'use client';

import type { Attachment, Message, ChatRequestOptions } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState } from 'react';
import equal from 'fast-deep-equal';
import cx from 'classnames';

import { 
  DocumentToolCall, 
  DocumentToolResult 
} from './document';
import { DocumentPreview } from './document-preview';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { MessageEditor } from './message-editor';
import { MessageReasoning } from './message-reasoning';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import { Chart } from './chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SparklesIcon, PencilEditIcon } from './icons';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Vote } from '@/lib/db/schema';

// === Sensor Data Summary Component ===
interface SensorDataSummaryProps {
  result: {
    data?: Array<{
      time: string;
      [key: string]: any;
    }>;
    summary?: string;
    error?: string;
    tableName?: string;
  };
}

const convertToWIB = (utcTime: string): string => {
  const utcDate = new Date(utcTime);
  const wibDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
  return wibDate.toISOString().replace('T', ' ').slice(0, 19) + ' WIB';
};

const SensorDataSummary = ({ result }: SensorDataSummaryProps) => {
  const convertedData = result.data?.map((row) => ({
    ...row,
    time: row.time ? convertToWIB(row.time) : row.time,
  }));

  const downloadCSV = () => {
    if (!convertedData?.length) return;

    const headers = Object.keys(convertedData[0]);
    const csvContent = [
      headers.join(','),
      ...convertedData.map((row) =>
        headers.map((header) => (row as any)[header] || '').join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Sensor Data Summary{result.tableName && ` - Table: ${result.tableName}`}
          <Button onClick={downloadCSV} size="sm" variant="outline" tabIndex={-1}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result.summary && <p className="text-sm text-muted-foreground mb-4">{result.summary}</p>}
        {result.error && <p className="text-sm text-red-500">{result.error}</p>}
        
        {convertedData && convertedData.length > 0 && (
          <div className="mt-4 max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {Object.keys(convertedData[0]).map((header) => (
                    <th key={header} className="text-left p-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {convertedData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="p-2">
                        {typeof value === 'number' ? (value as number).toFixed(3) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {convertedData.length > 10 && (
              <p className="text-xs text-muted-foreground mt-2">
                Showing first 10 of {convertedData.length} records
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// === Tool Result Renderer ===
const ToolResultRenderer = ({
  toolInvocation,
  isReadonly
}: {
  toolInvocation: any;
  isReadonly: boolean;
}) => {
  const { toolName, toolCallId, state, args, result } = toolInvocation;

  if (state === 'result') {
    switch (toolName) {
      case 'getWeather':
        return <Weather weatherAtLocation={result} />;
      
      case 'createDocument':
        return <DocumentPreview isReadonly={isReadonly} result={result} />;
      
      case 'updateDocument':
        return (
          <DocumentToolResult 
            type="update" 
            result={result} 
            isReadonly={isReadonly} 
          />
        );
      
      case 'requestSuggestions':
        return (
          <DocumentToolResult 
            type="request-suggestions" 
            result={result} 
            isReadonly={isReadonly} 
          />
        );
      
      case 'visualizeSensorData':
        return (
          <div className="space-y-4">
            {result.charts?.map((chart: any) => (
              <Chart
                key={chart.id}
                title={chart.title}
                chartType={chart.chartType}
                data={chart.data}
                xLabel={chart.xLabel}
                yLabel={chart.yLabel}
              />
            ))}
            {result.summary && (
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            )}
            {result.error && (
              <p className="text-sm text-red-500">Error: {result.error}</p>
            )}
          </div>
        );
      
      case 'createChart':
        return (
          <Chart
            title={result.title}
            chartType={result.chartType}
            data={result.data}
            xLabel={result.xLabel}
            yLabel={result.yLabel}
          />
        );
      
      case 'queryInfluxData':
        return <SensorDataSummary result={result} />;
      
      default:
        return (
          <div className="not-prose">
            <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        );
    }
  }

  // Loading state
  switch (toolName) {
    case 'getWeather':
      return <Weather />;
    
    case 'createDocument':
      return <DocumentPreview isReadonly={isReadonly} args={args} />;
    
    case 'updateDocument':
      return (
        <DocumentToolCall 
          type="update" 
          args={args} 
          isReadonly={isReadonly} 
        />
      );
    
    case 'requestSuggestions':
      return (
        <DocumentToolCall 
          type="request-suggestions" 
          args={args} 
          isReadonly={isReadonly} 
        />
      );
    
    default:
      return (
        <div className={cx({ skeleton: ['getWeather'].includes(toolName) })} />
      );
  }
};

// === Main Message Component ===
interface PreviewMessageProps {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
  isReadonly: boolean;
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
}

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  isReadonly,
  setMessages,
  reload,
}: PreviewMessageProps) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  // Helper function to prevent scroll on button interaction
  const preventScrollFocus = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
            {
              // 'group-data-[role=user]/message:bg-muted': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {/* Attachments */}
            {message.experimental_attachments && (
              <div className="flex flex-row justify-end gap-2">
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {/* Reasoning */}
            {message.reasoning && (
              <MessageReasoning
                isLoading={isLoading}
                reasoning={message.reasoning}
              />
            )}

            {/* Content */}
            {(message.content || message.reasoning) && mode === 'view' && (
              <div className="flex flex-row gap-2 items-start">
                {message.role === 'user' && !isReadonly && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        tabIndex={-1}
                        className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMode('edit');
                        }}
                        onMouseDown={preventScrollFocus}
                        onFocus={(e) => e.currentTarget.blur()}
                      >
                        <PencilEditIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit message</TooltipContent>
                  </Tooltip>
                )}

                <div
                  className={cn('flex flex-col gap-4', {
                    'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                      message.role === 'user',
                  })}
                >
                  <Markdown>{message.content as string}</Markdown>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {message.content && mode === 'edit' && (
              <div className="flex flex-row gap-2 items-start">
                <div className="size-8" />
                <MessageEditor
                  key={message.id}
                  message={message}
                  setMode={setMode}
                  setMessages={setMessages}
                  reload={reload}
                />
              </div>
            )}

            {/* Tool Invocations */}
            {message.toolInvocations && message.toolInvocations.length > 0 && (
              <div className="flex flex-col gap-4">
                {message.toolInvocations.map((toolInvocation) => (
                  <ToolResultRenderer
                    key={toolInvocation.toolCallId}
                    toolInvocation={toolInvocation}
                    isReadonly={isReadonly}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
                preventScrollFocus={preventScrollFocus}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.reasoning !== nextProps.message.reasoning) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (!equal(prevProps.message.toolInvocations, nextProps.message.toolInvocations)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    return true;
  },
);

// === Thinking Message Component ===
export const ThinkingMessage = () => (
  <motion.div
    className="w-full mx-auto max-w-3xl px-4 group/message"
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
    data-role="assistant"
  >
    <div className="flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl group-data-[role=user]/message:bg-muted">
      <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
        <SparklesIcon size={14} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-4 text-muted-foreground">
          Thinking...
        </div>
      </div>
    </div>
  </motion.div>
);
