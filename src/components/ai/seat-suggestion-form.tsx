'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getSeatSuggestions } from '@/app/actions';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  subjectInterest: z.string().min(1, 'Please select a subject'),
  learningStyle: z.string().min(1, 'Please select a learning style'),
});

type FormData = z.infer<typeof FormSchema>;

interface SeatSuggestionFormProps {
  availableSeats: string;
  onSuggestion: (seats: string[]) => void;
}

const subjectInterests = ['Computer Science', 'Law', 'Literature', 'Science & Engineering', 'Arts & Humanities', 'Medicine'];
const learningStyles = ['Quiet & Focused', 'Collaborative & Group Work', 'Visual & Near Windows', 'Casual & Near Exits'];

export default function SeatSuggestionForm({ availableSeats, onSuggestion }: SeatSuggestionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subjectInterest: '',
      learningStyle: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    onSuggestion([]);

    const result = await getSeatSuggestions({ ...data, availableSeats });
    
    if (result.success && result.seats) {
      onSuggestion(result.seats);
      toast({
          title: "Suggestions Found!",
          description: `We found ${result.seats.length} great seats for you.`,
      })
    } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: result.error || "There was a problem with your request.",
        })
    }

    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="w-5 h-5 text-accent" /> AI Seat Suggester</CardTitle>
        <CardDescription>Tell us your preferences, and we'll find the perfect spot for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subjectInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Interest</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="e.g., Computer Science" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectInterests.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="learningStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="e.g., Quiet & Focused" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {learningStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Finding Seats...' : 'Get Suggestions'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
