import { createFileRoute } from "@tanstack/react-router";
import Index from "../pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Plug X | VIP Playlist" },
      { name: "description", content: "Premium Plug X community and VIP playlist updates." },
      { property: "og:title", content: "Premium Plug X | VIP Playlist" },
      { property: "og:description", content: "Premium Plug X community and VIP playlist updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});
