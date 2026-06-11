import React from "react";
import BWChip from "./BWChip";
import GlassBar, { GlassBarProps } from "./GlassBar";

type ChipSpec = React.ComponentProps<typeof BWChip>;

type ChipBoardProps = {
  /** GlassBar customization */
  bar?: Partial<GlassBarProps>;
  /** বাম দিকের চিপ সেট */
  leftChips?: ChipSpec[];
  /** ডান দিকের চিপ সেট */
  rightChips?: ChipSpec[];
  /** দুই পাশে গ্যাপ */
  gap?: number;
};

const ChipBoard: React.FC<ChipBoardProps> = ({
  bar,
  leftChips = [],
  rightChips = [],
  gap = 8,
}) => {
  return (
    <GlassBar
      height={bar?.height ?? 110}
      width={bar?.width ?? "100%"}
      radius={bar?.radius ?? 20}
      gradient={bar?.gradient}
      ringColor={bar?.ringColor}
      gloss={bar?.gloss ?? true}
      innerRim={bar?.innerRim ?? true}
      bottomBeam={
        bar?.bottomBeam ?? {
          color: "#e6ff9a",
          height: 3,
          offset: 10,
          opacity: 0.8,
          blur: 0.5,
        }
      }
      grain={bar?.grain ?? true}
      paddingX={bar?.paddingX ?? 8}
      className={bar?.className}
      contentClassName="flex items-center justify-between w-full"
    >
      {/* Left chips */}
      <div className="flex items-center" style={{ gap }}>
        {leftChips.map((props, i) => (
          <BWChip key={i} {...props} />
        ))}
      </div>

      {/* Right chips */}
      <div className="flex items-center" style={{ gap }}>
        {rightChips.map((props, i) => (
          <BWChip key={i} {...props} />
        ))}
      </div>
    </GlassBar>
  );
};

export default ChipBoard;
