import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Robot · MakEMinds Robotics · DECODE 2025-26";

export default function OG() {
  return renderOg({ title: "ROBOT", meta: "DECODE · 2025–26 · FTC 23786" });
}
