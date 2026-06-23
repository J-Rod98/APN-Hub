// 404 page.
import { Button } from "@/components/ui/Button";
import { FlameLogo } from "@/components/ui/FlameLogo";

export default function NotFound() {
  return (
    <div className="container-app flex flex-col items-center gap-4 py-24 text-center">
      <FlameLogo size={48} />
      <h1 className="text-3xl font-black">Page not found</h1>
      <p className="max-w-md text-ink-muted">
        We couldn&apos;t find that page. Let&apos;s get you back to the hub.
      </p>
      <Button href="/">Back to Home</Button>
    </div>
  );
}
