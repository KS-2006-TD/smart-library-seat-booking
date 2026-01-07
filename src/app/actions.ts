'use server';

import { suggestSeatsBasedOnProfile, SuggestSeatsBasedOnProfileInput } from '@/ai/flows/suggest-seats-based-on-profile';

export async function getSeatSuggestions(input: SuggestSeatsBasedOnProfileInput) {
    try {
        const result = await suggestSeatsBasedOnProfile(input);
        const suggestedSeats = result.suggestedSeats.split(',').map(s => s.trim()).filter(Boolean);
        return { success: true, seats: suggestedSeats };
    } catch (error) {
        console.error("AI suggestion failed:", error);
        return { success: false, error: 'Failed to get suggestions.' };
    }
}
