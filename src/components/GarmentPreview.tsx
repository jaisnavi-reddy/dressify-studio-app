import { availablePatterns } from "@/data/designs";

interface GarmentPreviewProps {
  colors: { body: string; sleeve: string; border: string };
  pattern: string;
  size?: "sm" | "md" | "lg";
}

export default function GarmentPreview({ colors, pattern, size = "md" }: GarmentPreviewProps) {
  const patternClass = availablePatterns.find((p) => p.id === pattern)?.className || "";
  const sizeMap = { sm: "w-24 h-32", md: "w-40 h-52", lg: "w-64 h-80" };

  return (
    <div className={`${sizeMap[size]} relative mx-auto`}>
      {/* Sleeves */}
      <div
        className={`absolute top-4 -left-4 w-10 rounded-lg ${patternClass}`}
        style={{ backgroundColor: colors.sleeve, height: "40%" }}
      />
      <div
        className={`absolute top-4 -right-4 w-10 rounded-lg ${patternClass}`}
        style={{ backgroundColor: colors.sleeve, height: "40%" }}
      />
      {/* Body */}
      <div
        className={`absolute inset-x-2 top-0 bottom-0 rounded-t-2xl rounded-b-lg ${patternClass}`}
        style={{ backgroundColor: colors.body }}
      />
      {/* Border/hem */}
      <div
        className="absolute bottom-0 inset-x-2 h-6 rounded-b-lg"
        style={{ backgroundColor: colors.border }}
      />
      {/* Neckline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 rounded-b-full bg-background" />
    </div>
  );
}
