type SquigglyTextProps = {
  children: React.ReactNode
}

export function SquigglyText({ children }: SquigglyTextProps) {
  return (
    <>
      <span className="squiggly-text">{children}</span>
      <svg className="squiggly-filters" aria-hidden="true">
        <defs>
          {[0, 1, 2, 3].map((seed) => (
            <filter key={seed} id={`hero-squiggly-${seed}`}>
              <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed={seed} />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={seed % 2 === 0 ? 2 : 3}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>
    </>
  )
}
