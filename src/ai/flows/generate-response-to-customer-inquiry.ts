'use server';

/**
 * @fileOverview An AI agent that generates real-time responses to customer inquiries.
 *
 * - generateResponseToCustomerInquiry - A function that generates a response to a customer inquiry.
 * - GenerateResponseToCustomerInquiryInput - The input type for the generateResponseToCustomerInquiry function.
 * - GenerateResponseToCustomerInquiryOutput - The return type for the generateResponseToCustomerInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseToCustomerInquiryInputSchema = z.object({
  customerInquiry: z.string().describe('The customer inquiry.'),
  customerServiceContext: z
    .string()
    .optional()
    .describe('Contextual information about the customer or their issue.'),
});

export type GenerateResponseToCustomerInquiryInput = z.infer<
  typeof GenerateResponseToCustomerInquiryInputSchema
>;

const GenerateResponseToCustomerInquiryOutputSchema = z.object({
  response: z.string().describe('The generated response to the customer inquiry.'),
  sentiment: z.string().describe('The sentiment of the customer inquiry.'),
});

export type GenerateResponseToCustomerInquiryOutput = z.infer<
  typeof GenerateResponseToCustomerInquiryOutputSchema
>;

export async function generateResponseToCustomerInquiry(
  input: GenerateResponseToCustomerInquiryInput
): Promise<GenerateResponseToCustomerInquiryOutput> {
  return generateResponseToCustomerInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponseToCustomerInquiryPrompt',
  input: {
    schema: GenerateResponseToCustomerInquiryInputSchema,
  },
  output: {
    schema: GenerateResponseToCustomerInquiryOutputSchema,
  },
  prompt: `You are an AI-powered customer service agent. Your goal is to provide real-time, accurate answers to customer inquiries.

  Analyze the customer inquiry and generate a helpful and informative response. Also, determine the sentiment of the customer inquiry (positive, negative, or neutral).

  Customer Inquiry: {{{customerInquiry}}}

  {{#if customerServiceContext}}
  Customer Service Context: {{{customerServiceContext}}}
  {{/if}}`,
});

const generateResponseToCustomerInquiryFlow = ai.defineFlow(
  {
    name: 'generateResponseToCustomerInquiryFlow',
    inputSchema: GenerateResponseToCustomerInquiryInputSchema,
    outputSchema: GenerateResponseToCustomerInquiryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
