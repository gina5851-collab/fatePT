"use client";

import { useEffect, useState } from "react";

const GOLD = "#c9a24b";

type Props = {
  nameKo: string;
  nameEn: string;
  orientation: "upright" | "reversed";
  position: string;
  index: number; // 등장 순서(스태거)
};

// 카드 뒷면 → 앞면 플립. 이미지가 없으므로 앞면은 카드명 + 정/역방향 표시.
export function TarotCard({ nameKo, nameEn, orientation, position, index }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 250 + index * 320);
    return () => clearTimeout(t);
  }, [index]);

  const reversed = orientation === "reversed";

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] font-mono text-center" style={{ color: GOLD }}>
        {position}
      </p>
      <div style={{ perspective: "1000px" }} className="w-[120px] h-[200px]">
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* 뒷면 */}
          <div
            className="absolute inset-0 rounded-xl flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(145deg,#0c1730,#1c2c4c)",
              border: `1.5px solid ${GOLD}`,
            }}
          >
            <div
              className="w-[70%] h-[85%] rounded-lg flex items-center justify-center"
              style={{ border: `1px solid ${GOLD}66` }}
            >
              <span style={{ color: GOLD }} className="text-2xl">
                ✦
              </span>
            </div>
          </div>

          {/* 앞면 */}
          <div
            className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 p-3 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(160deg,#11203c,#0c1730)",
              border: `1.5px solid ${GOLD}`,
            }}
          >
            <span
              className="text-3xl"
              style={{ color: GOLD, display: "inline-block", transform: reversed ? "rotate(180deg)" : "none" }}
            >
              ✦
            </span>
            <span className="text-sm font-semibold text-ink leading-tight">{nameKo}</span>
            <span className="text-[10px] font-mono text-mute leading-tight">{nameEn}</span>
            <span
              className="text-[10px] font-mono rounded-full px-2 py-0.5 mt-1"
              style={{ color: reversed ? "#e0a0a0" : GOLD, border: `1px solid ${reversed ? "#e0a0a0" : GOLD}` }}
            >
              {reversed ? "역방향" : "정방향"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
