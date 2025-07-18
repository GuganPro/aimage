import { ImageGenerator } from '@/components/image-generator';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground py-2 px-4 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium">AI Vision Weaver</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-headline">
            Craft Your Vision into Art
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Describe your imagination and let our AI bring it to life. From surreal landscapes to futuristic concepts, the possibilities are endless.
          </p>
        </header>

        <ImageGenerator />
      </div>
    </main>
  );
}
