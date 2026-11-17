import { musicVideos,newsArticles } from "@/lib/discovered-content";
import type { MetadataRoute } from "next";
import { getEvents, getPodcast, getPreaching } from "@/lib/data";
import { guides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

const LAUNCH_DATE = new Date("2026-07-17T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/preaching/", "/podcast/", "/events/", "/materials/", "/guides/", "/news/", "/music/", "/general-conference-2026/", "/nayc-2027/", "/about/", "/privacy/", "/submit/"];
  const dated = (path: string, date: string) => ({
    url: absoluteUrl(path),
    lastModified: new Date(date),
  });

  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: LAUNCH_DATE })),
    ...getPreaching().map((item) => dated(`/preaching/${item.id}/`, item.created_at)),
    ...getPodcast().map((episode) => dated(`/podcast/${episode.id}/`, episode.created_at)),
    ...getEvents().map((event) => dated(`/events/${event.id}/`, event.created_at)),
    ...musicVideos.map(v=>dated(`/music/${v.id}/`,v.publishedAt)),
    ...newsArticles.map(n=>dated(`/news/${n.slug}/`,n.publishedAt)),
    ...guides.map((guide) => dated(`/guides/${guide.slug}/`, guide.publishedAt)),
  ];
}
