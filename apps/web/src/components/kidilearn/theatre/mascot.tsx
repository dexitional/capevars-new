import { motion } from 'motion/react'

// Kidi, the owl who hosts the younger lessons. The beak moves while Kidi talks.
export function Mascot({
  talking,
  mood = 'calm',
  className,
}: {
  talking: boolean
  mood?: 'calm' | 'happy' | 'hmm'
  className?: string
}) {
  return (
    <motion.svg
      viewBox="0 0 120 130"
      className={className}
      aria-hidden="true"
      animate={mood === 'happy' ? { y: [0, -14, 0, -8, 0] } : { y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <path d="M22 32 14 10l26 14ZM98 32l8-22-26 14Z" fill="#7a4a21" />
      <ellipse cx="60" cy="72" rx="44" ry="50" fill="#a0642e" />
      <ellipse cx="60" cy="88" rx="28" ry="30" fill="#f5deb3" />
      <g fill="#f5deb3">
        <circle cx="41" cy="46" r="19" />
        <circle cx="79" cy="46" r="19" />
      </g>
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
        style={{ transformOrigin: '60px 46px' }}
        fill="#22172f"
      >
        <circle cx="42" cy="46" r={mood === 'happy' ? 10 : 8} />
        <circle cx="78" cy="46" r={mood === 'happy' ? 10 : 8} />
        <circle cx="45" cy="43" r="2.6" fill="#fff" />
        <circle cx="81" cy="43" r="2.6" fill="#fff" />
      </motion.g>
      <motion.path
        d="M52 60h16l-8 11Z"
        fill="#f59f00"
        animate={talking ? { scaleY: [1, 1.6, 0.9, 1.4, 1] } : { scaleY: 1 }}
        transition={talking ? { duration: 0.5, repeat: Infinity } : undefined}
        style={{ transformOrigin: '60px 60px' }}
      />
      {/* A kente-coloured scarf ties Kidi to home. */}
      <g>
        <rect x="26" y="104" width="68" height="14" rx="7" fill="#d9480f" />
        <rect x="38" y="104" width="10" height="14" fill="#fcc419" />
        <rect x="56" y="104" width="10" height="14" fill="#2b8a3e" />
        <rect x="74" y="104" width="10" height="14" fill="#fcc419" />
      </g>
    </motion.svg>
  )
}
