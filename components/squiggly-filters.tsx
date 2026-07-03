export function SquigglyFilters() {
  const seeds = [0, 1, 2, 3, 4]
  const scales = [2, 3, 2, 3, 2]
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden" style={{ display: "none" }} aria-hidden>
      <defs>
        {seeds.map((seed, i) => (
          <filter key={seed} id={`squiggly-${seed}`}>
            <feTurbulence baseFrequency="0.02" numOctaves={3} result="noise" seed={seed} />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scales[i]}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>
  )
}
