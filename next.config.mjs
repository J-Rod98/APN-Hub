/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Phase 1 keeps things simple. Add image domains / remotePatterns here
  // later if/when we host media on Supabase Storage or a CDN.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
