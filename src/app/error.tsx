"use client";
// Root error boundary.
import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-app flex flex-col items-center gap-4 py-24 text-center">
      <div className="text-5xl">⚠️</div>
      <h1 className="text-2xl font-extrabold">Something went wrong</h1>
      <p className="max-w-md text-ink-muted">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-gradient-to-br from-brand to-brand-deep px-5 py-3 font-bold text-white shadow-glow"
      >
        Try again
      </button>
      <Button href="/" variant="ghost" size="sm">Back to Home</Button>
    </div>
  );
}
