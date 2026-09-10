import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "MakEMinds Robotics · FTC Team 23786 · Edison NJ";

export default function OG() {
  return renderOg({ title: ["MAKEMINDS", "ROBOTICS"], meta: "FTC TEAM 23786" });
}
