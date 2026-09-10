import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Notebook · MakEMinds Robotics engineering log";

export default function OG() {
  return renderOg({ title: "NOTEBOOK", meta: "ENGINEERING LOG · FTC 23786" });
}
