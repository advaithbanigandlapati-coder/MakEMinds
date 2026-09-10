import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Team · MakEMinds Robotics";

export default function OG() {
  return renderOg({ title: "TEAM", meta: "FTC 23786 · ROSTER 2025–26" });
}
