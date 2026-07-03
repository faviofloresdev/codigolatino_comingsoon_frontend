import Image from 'next/image'

export default function MaskLogoCanvas() {
  return (
    <div
      aria-hidden
      className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52"
    >
      <div className="absolute inset-3 rounded-full bg-emerald-400/10 blur-2xl" />
      <Image
        src="/mask.svg"
        alt=""
        fill
        sizes="(max-width: 640px) 176px, 208px"
        className="object-contain drop-shadow-[0_18px_40px_rgba(16,185,129,0.22)]"
        priority
      />
    </div>
  )
}
