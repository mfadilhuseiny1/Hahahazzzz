import { tool } from 'ai';
import { z } from 'zod';

export const createChart = tool({
  description: 'Create charts and visualizations from sensor data or any numerical data',
  parameters: z.object({
    title: z.string().describe('Chart title'),
    type: z.enum(['line', 'bar', 'scatter']).describe('Chart type'),
    data: z.array(z.object({
      x: z.union([z.string(), z.number()]).describe('X-axis value'),
      y: z.number().describe('Y-axis value'),
      label: z.string().optional().describe('Data point label')
    })).describe('Chart data points'),
    xLabel: z.string().optional().describe('X-axis label'),
    yLabel: z.string().optional().describe('Y-axis label')
  }),
  execute: async ({ title, type, data, xLabel, yLabel }) => {
    return {
      type: 'chart',
      title,
      chartType: type,
      data,
      xLabel: xLabel || 'X',
      yLabel: yLabel || 'Y',
      id: `chart-${Date.now()}`
    };
  },
});
