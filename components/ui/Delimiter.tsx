interface DividerProps {
  width?: string; // যেমন "200px", "100%"
  gap?: string; // যেমন "5px", "10px"
}

const Delimiter = ({ width = "200px", gap = "10px" }: DividerProps) => {
  return (
    <div className="my-4 flex justify-center">
      <div
        className="delimiter"
        style={{
          ["--stb-divider-width" as any]: width,
          ["--stb-gap" as any]: gap,
        }}
      ></div>
    </div>
  );
};

export default Delimiter;
