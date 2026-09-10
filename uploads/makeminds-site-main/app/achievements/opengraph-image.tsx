import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Achievements · MakEMinds Robotics · 27 events, 8 awards";

export default function OG() {
  return renderOg({ title: ["27 EVENTS", "8 AWARDS"], meta: "ACHIEVEMENTS · FTC 23786" });
}
