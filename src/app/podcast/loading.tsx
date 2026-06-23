import { SkeletonGrid } from "@/components/ui/States";
export default function Loading() {
  return (
    <div className="container-app py-12">
      <div className="mb-7 h-10 w-48 animate-pulse rounded-lg bg-navy-850/60" />
      <SkeletonGrid count={4} />
    </div>
  );
}
