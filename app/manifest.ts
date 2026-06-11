import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gyonex Trade",
    short_name: "Gyonex",
    description: "Trade on your favorite trading platforms with Gyonex Trade",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#061326",
    theme_color: "#061326",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
