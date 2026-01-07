'use server';
/**
 * @fileOverview An AI agent that suggests seats based on a user's profile.
 *
 * - suggestSeatsBasedOnProfile - A function that handles the seat suggestion process.
 * - SuggestSeatsBasedOnProfileInput - The input type for the suggestSeatsBasedOnProfile function.
 * - SuggestSeatsBasedOnProfileOutput - The return type for the suggestSeatsBasedOnProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSeatsBasedOnProfileInputSchema = z.object({
  subjectInterest: z.string().describe('The user\'s subject interest.'),
  learningStyle: z.string().describe('The user\'s learning style.'),
  availableSeats: z.string().describe('The available seats in the library.'),
});
export type SuggestSeatsBasedOnProfileInput = z.infer<typeof SuggestSeatsBasedOnProfileInputSchema>;

const SuggestSeatsBasedOnProfileOutputSchema = z.object({
  suggestedSeats: z.string().describe('The suggested seats based on the user\'s profile.'),
});
export type SuggestSeatsBasedOnProfileOutput = z.infer<typeof SuggestSeatsBasedOnProfileOutputSchema>;

export async function suggestSeatsBasedOnProfile(input: SuggestSeatsBasedOnProfileInput): Promise<SuggestSeatsBasedOnProfileOutput> {
  return suggestSeatsBasedOnProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSeatsBasedOnProfilePrompt',
  input: {schema: SuggestSeatsBasedOnProfileInputSchema},
  output: {schema: SuggestSeatsBasedOnProfileOutputSchema},
  prompt: `You are a helpful AI assistant that suggests seats based on the user's profile.

You will use the user's subject interest, learning style, and available seats to suggest the best seats for the user.

Subject Interest: {{{subjectInterest}}}
Learning Style: {{{learningStyle}}}
Available Seats: {{{availableSeats}}}

Suggested Seats:`,
});

const suggestSeatsBasedOnProfileFlow = ai.defineFlow(
  {
    name: 'suggestSeatsBasedOnProfileFlow',
    inputSchema: SuggestSeatsBasedOnProfileInputSchema,
    outputSchema: SuggestSeatsBasedOnProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
