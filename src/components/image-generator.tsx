'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { generateImageAction } from '@/app/actions';
import { Wand2, Download, Image as ImageIcon, Loader2 } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Please enter a more detailed prompt (at least 10 characters).',
  }),
});

export function ImageGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            if (interval) clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
    } else {
        setProgress(0);
        if(interval) clearInterval(interval);
    }
    return () => {
        if (interval) clearInterval(interval);
    }
  }, [isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setProgress(5);
    setGeneratedImageUrl(null);

    const result = await generateImageAction(values.prompt);

    if (result.success && result.imageUrl) {
      setProgress(100);
      setGeneratedImageUrl(result.imageUrl);
      toast({
        title: 'Success!',
        description: 'Your image has been generated.',
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.error || 'There was a problem with your request.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Your Vision</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A cinematic shot of a raccoon astronaut on a neon-lit alien planet"
                        className="min-h-[100px] resize-none text-base bg-background/70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Weaving Magic...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {isLoading && (
          <CardFooter className="p-6 pt-0">
            <Progress value={progress} className="w-full" />
          </CardFooter>
        )}
      </Card>

      {generatedImageUrl ? (
        <Card className="overflow-hidden shadow-2xl shadow-primary/10">
          <CardContent className="p-0 relative aspect-video">
             <Image
                src={generatedImageUrl}
                alt="Generated AI Image"
                fill
                className="object-cover transition-all duration-500 hover:scale-105"
                data-ai-hint="generated art"
              />
          </CardContent>
          <CardFooter className="bg-card/50 p-4 flex justify-end">
            <a href={generatedImageUrl} download={`ai-vision-${Date.now()}.png`}>
              <Button variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          </CardFooter>
        </Card>
      ) : !isLoading && (
         <Card className="border-dashed border-2 border-border/50 bg-transparent flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <ImageIcon className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Your Artwork Awaits</h3>
            <p>The image you generate will appear here.</p>
         </Card>
      )}
    </div>
  );
}
