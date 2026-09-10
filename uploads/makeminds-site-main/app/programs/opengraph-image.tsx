import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Programs · MakEMinds Robotics";

export default function OG() {
  return renderOg({ title: "PROGRAMS", meta: "FTC · FLL · OUTREACH" });
}
