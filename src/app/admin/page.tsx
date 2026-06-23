// Admin dashboard page — fetches all data (server) and hands it to the
// interactive dashboard client component.
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  getAdminStats,
  getAllSubmissions,
  getAdminEvents,
  getAdminPreaching,
  getAdminPodcast,
  getAdminMaterials,
  getAdminPrayers,
  getSubscribers,
} from "@/lib/data";

// Always render fresh data (no static caching for the admin area).
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [stats, submissions, events, preaching, podcast, materials, prayers, subscribers] =
    await Promise.all([
      getAdminStats(),
      getAllSubmissions(),
      getAdminEvents(),
      getAdminPreaching(),
      getAdminPodcast(),
      getAdminMaterials(),
      getAdminPrayers(),
      getSubscribers(),
    ]);

  return (
    <AdminDashboard
      stats={stats}
      submissions={submissions}
      events={events}
      preaching={preaching}
      podcast={podcast}
      materials={materials}
      prayers={prayers}
      subscribers={subscribers}
      demo={stats.demo}
    />
  );
}
