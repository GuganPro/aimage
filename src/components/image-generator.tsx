'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';

import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateImageAction } from '@/app/actions';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [debouncedPrompt] = useDebounce(prompt, 600);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = useCallback(async (currentPrompt: string) => {
    if (currentPrompt.length < 10) {
      setGeneratedImageUrl(null);
      setError('Please enter a more detailed prompt (at least 10 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await generateImageAction(currentPrompt);

    if (result.success && result.imageUrl) {
      setGeneratedImageUrl(result.imageUrl);
    } else {
      setGeneratedImageUrl(null);
      setError(result.error || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Image Generation Failed',
        description: result.error || 'There was a problem with your request.',
      });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    if (debouncedPrompt) {
      generateImage(debouncedPrompt);
    }
  }, [debouncedPrompt, generateImage]);
  

  return (
    <div className="space-y-8">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-2">
             <label htmlFor="prompt-textarea" className="text-lg font-medium">Your Vision</label>
             <Textarea
                id="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A cinematic shot of a raccoon astronaut on a neon-lit alien planet"
                className="min-h-[100px] resize-none text-base bg-background/70"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-dashed border-2 border-border/50 bg-transparent flex flex-col items-center justify-center p-12 text-center text-muted-foreground aspect-square relative shadow-inner">
        {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center z-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-foreground">Generating...</p>
            </div>
        )}
        {generatedImageUrl ? (
            <Image
                src={generatedImageUrl}
                alt={prompt}
                fill
                className="object-cover rounded-lg"
                data-ai-hint="generated art"
            />
        ) : !isLoading && (
            <>
                <ImageIcon className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-semibold text-foreground">Your Artwork Awaits</h3>
                <p>Start typing your prompt above to generate an image.</p>
            </>
        )}
      </Card>
    </div>
  );
}
