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
  subjectInterest: z.string().describe("The user's subject interest."),
  learningStyle: z.string().describe("The user's learning style."),
  availableSeats: z.string().describe('A comma-separated list of available seat labels.'),
});
export type SuggestSeatsBasedOnProfileInput = z.infer<typeof SuggestSeatsBasedOnProfileInputSchema>;

const SuggestSeatsBasedOnProfileOutputSchema = z.object({
  suggestedSeats: z.string().describe("A comma-separated list of suggested seat labels based on the user's profile."),
});
export type SuggestSeatsBasedOnProfileOutput = z.infer<typeof SuggestSeatsBasedOnProfileOutputSchema>;

export async function suggestSeatsBasedOnProfile(input: SuggestSeatsBasedOnProfileInput): Promise<SuggestSeatsBasedOnProfileOutput> {
  return suggestSeatsBasedOnProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSeatsBasedOnProfilePrompt',
  input: {schema: SuggestSeatsBasedOnProfileInputSchema},
  output: {schema: SuggestSeatsBasedOnProfileOutputSchema},
  prompt: `You are a helpful AI assistant for a library seat booking system. Your task is to suggest the best available seats to a student based on their preferences.

Analyze the user's subject interest and learning style to recommend up to 5 suitable seats from the list of available seats.

- **Learning Style Guide:**
  - 'Quiet & Focused': Prefer seats away from high-traffic areas like entrances or group tables. Individual desks are ideal.
  - 'Collaborative & Group Work': Suggest seats at group tables or in designated group study areas.
  - 'Visual & Near Windows': Prioritize seats labeled with 'W' or near window areas if discernible from seat labels.
  - 'Casual & Near Exits': Suggest seats near the entrance/exit if possible.

- **Subject Interest Guide:**
  - 'Science & Engineering', 'Computer Science', 'Medicine': These students often need quiet, focused areas.
  - 'Law', 'Literature', 'Arts & Humanities': These students might appreciate quiet areas but could also benefit from being near relevant book sections (if the layout implies this).

- **Available Seats:** The seats are provided as a comma-separated string.

Based on these factors, return a comma-separated list of the best seat labels for the user.

**User Profile:**
- Subject Interest: {{{subjectInterest}}}
- Learning Style: {{{learningStyle}}}

**Available Seats:**
{{{availableSeats}}}

**Your Suggested Seats (comma-separated):**
`,
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
