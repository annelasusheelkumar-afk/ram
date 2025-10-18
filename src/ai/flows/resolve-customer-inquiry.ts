'use server';

/**
 * @fileOverview An AI agent that attempts to resolve a customer inquiry automatically.
 *
 * - resolveCustomerInquiry - A function that generates a step-by-step solution.
 * - ResolveCustomerInquiryInput - The input type for the resolveCustomerInquiry function.
 * - ResolveCustomerInquiryOutput - The return type for the resolveCustomerInquiry function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResolveCustomerInquiryInputSchema = z.object({
  inquiryTitle: z.string().describe('The title of the customer inquiry.'),
  inquiryMessage: z.string().describe('The latest message from the customer.'),
});
export type ResolveCustomerInquiryInput = z.infer<typeof ResolveCustomerInquiryInputSchema>;

const ResolveCustomerInquiryOutputSchema = z.object({
  isResolved: z
    .boolean()
    .describe(
      'Whether the provided steps are likely to fully resolve the issue.'
    ),
  resolutionSteps: z
    .array(z.string())
    .describe(
      'A list of concrete, actionable steps for the user to take. Keep steps concise.'
    ),
  resolutionSummary: z
    .string()
    .describe(
      'A concluding summary of the resolution steps and what to do if the issue persists.'
    ),
});
export type ResolveCustomerInquiryOutput = z.infer<typeof ResolveCustomerInquiryOutputSchema>;

export async function resolveCustomerInquiry(
  input: ResolveCustomerInquiryInput
): Promise<ResolveCustomerInquiryOutput> {
  return resolveCustomerInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveCustomerInquiryPrompt',
  input: { schema: ResolveCustomerInquiryInputSchema },
  output: { schema: ResolveCustomerInquiryOutputSchema },
  prompt: `You are an expert customer support agent. Your task is to resolve a customer's issue based on their inquiry.

Analyze the inquiry title and the customer's message.
- If you can provide a clear, step-by-step solution, populate the 'resolutionSteps' array.
- Determine if your solution is likely to fully resolve the problem and set 'isResolved' to true or false.
- Provide a brief 'resolutionSummary' to explain the outcome or next steps.
- If you cannot resolve the issue or need more information, leave 'resolutionSteps' empty and set 'isResolved' to false.

Inquiry Title: {{{inquiryTitle}}}
Customer Message: {{{inquiryMessage}}}
`,
});

const resolveCustomerInquiryFlow = ai.defineFlow(
  {
    name: 'resolveCustomerInquiryFlow',
    inputSchema: ResolveCustomerInquiryInputSchema,
    outputSchema: ResolveCustomerInquiryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
