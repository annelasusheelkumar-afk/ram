'use server';

/**
 * @fileOverview An AI agent that detects recurring issues from a list of inquiries.
 *
 * - detectRecurringIssues - A function that analyzes inquiry titles for patterns.
 * - DetectRecurringIssuesInput - The input type for the function.
 * - DetectRecurringIssuesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectRecurringIssuesInputSchema = z.object({
  inquiryTitles: z
    .array(z.string())
    .describe('A list of titles from customer inquiries.'),
});
export type DetectRecurringIssuesInput = z.infer<
  typeof DetectRecurringIssuesInputSchema
>;

const RecurringIssueSchema = z.object({
  theme: z.string().describe('The common theme or category of the issue.'),
  summary: z
    .string()
    .describe('A brief summary of the recurring problem.'),
  count: z.number().describe('The number of inquiries related to this theme.'),
});

const DetectRecurringIssuesOutputSchema = z.object({
  recurringIssues: z
    .array(RecurringIssueSchema)
    .describe(
      'A list of detected recurring issues, sorted from most to least frequent.'
    ),
});
export type DetectRecurringIssuesOutput = z.infer<
  typeof DetectRecurringIssuesOutputSchema
>;

export async function detectRecurringIssues(
  input: DetectRecurringIssuesInput
): Promise<DetectRecurringIssuesOutput> {
  return detectRecurringIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectRecurringIssuesPrompt',
  input: { schema: DetectRecurringIssuesInputSchema },
  output: { schema: DetectRecurringIssuesOutputSchema },
  prompt: `You are a data analyst specializing in customer support trends. Your task is to identify recurring issues from a list of customer inquiry titles.

Analyze the following inquiry titles:
{{#each inquiryTitles}}
- {{{this}}}
{{/each}}

Group similar issues into themes. For each theme, provide a concise summary of the problem and count how many inquiries fall into that theme. Return a list of these themes, ordered by the count from highest to lowest. If there are no recurring issues, return an empty array.
`,
});

const detectRecurringIssuesFlow = ai.defineFlow(
  {
    name: 'detectRecurringIssuesFlow',
    inputSchema: DetectRecurringIssuesInputSchema,
    outputSchema: DetectRecurringIssuesOutputSchema,
  },
  async (input) => {
    // Ensure we don't send an empty list to the model.
    if (input.inquiryTitles.length === 0) {
      return { recurringIssues: [] };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
