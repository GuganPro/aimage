'use server';

import { generateImage } from '@/ai/flows/generate-image';
import { z } from 'zod';

export async function generateImageAction(prompt: string): Promise<{
  success: boolean;
  imageUrl: string | null;
  error: string | null;
}> {
  const promptSchema = z.string().min(3);
  const validation = promptSchema.safeParse(prompt);

  if (!validation.success) {
    return {
      success: false,
      imageUrl: null,
      error: 'Please enter a more detailed prompt (at least 3 characters).',
    };
  }

  try {
    const result = await generateImage({ prompt });
    if (!result.imageUrl) {
      return {
        success: false,
        imageUrl: null,
        error: 'Image generation failed. The AI may be busy, please try again.',
      };
    }
    return { success: true, imageUrl: result.imageUrl, error: null };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      imageUrl: null,
      error: 'An unexpected error occurred during image generation.',
    };
  }
}
