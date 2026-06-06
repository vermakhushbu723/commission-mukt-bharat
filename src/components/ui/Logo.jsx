import logoUrl from '../../assets/logo.jpeg'

/* Commission-Mukt Bharat brand lockup — the supplied artwork: a raised fist
   holding rupee notes inside an Ashoka-chakra ring above the tricolour
   "BHARAT" wordmark.

   Size it with a height class via `className` (e.g. "h-12 w-auto").
   `variant="dark"` rests the white-ground artwork on a small white plaque so
   it reads cleanly on the charcoal footer / dark sections. */
export default function Logo({ variant = 'light', className = 'h-12 w-auto' }) {
  const dark = variant === 'dark'

  return (
    <img
      src={logoUrl}
      alt="Commission-Mukt Bharat emblem"
      width={270}
      height={358}
      draggable="false"
      loading="eager"
      decoding="async"
      className={`shrink-0 select-none object-contain transition-transform duration-300 ease-out group-hover:scale-105 ${
        dark ? 'bg-paper rounded-xl p-1.5 shadow-md' : ''
      } ${className}`}
    />
  )
}
