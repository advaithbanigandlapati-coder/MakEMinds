import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Contact · MakEMinds Robotics";

export default function OG() {
  return renderOg({ title: "CONTACT", meta: "TRANSMIT · FTC 23786" });
}
