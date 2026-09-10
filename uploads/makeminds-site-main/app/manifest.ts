import type { MetadataRoute } from "next";

/*
  Web app manifest. Lets the site be added to a phone's home screen with
  team branding instead of a generic browser shortcut. Not a full PWA —
  we don't ship a service worker or claim offline support.
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MakEMinds Robotics · FTC 23786",
    short_name: "MakEMinds",
    description:
      "FTC Team 23786 — student-led robotics from Edison, NJ.",
    start_url: "/",
    display: "standalone",
    background_color: "#050506",
    theme_color: "#050506",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
