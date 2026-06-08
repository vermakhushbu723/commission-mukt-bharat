// Central, content-only source of truth for the site.
// Keeping copy out of components makes the markup readable and easy to edit.

export const SITE = {
  name: 'Commission-Mukt Bharat',
  nameHindi: 'कमीशन-मुक्त भारत',
  abbr: 'CMB',
  established: 'Est. 2026',
  tagline: 'Towards a Corruption-Free India',
  foundedDate: '16 . 05 . 2026',
  emails: {
    contact: 'contact@commissionmuktbharat.org',
    press: 'info@commissionmuktbharat.org',
  },
  memberCount: '21,639',
  weekJoins: 6994,
}

export const HERO_STATS = [
  { value: '21,639', label: 'Members & counting' },
  { value: '5', label: 'Demands' },
  { value: '0', label: 'Corporate donors' },
  { value: '∞', label: 'Patience' },
]

export const NAV_LINKS = [
  { label: 'Vision', href: '/#vision' },
  { label: 'Articles', href: '/articles' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Members', href: '/members' },
  { label: 'Issues', href: '/issues' },
  { label: 'Contact', href: '/#contact' },
]

export const SOCIAL_LINKS = [
  { id: 'x', label: 'X', href: 'https://x.com/commissionmuktbharat' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/commissionmuktbharat/' },
  { id: 'reddit', label: 'Reddit', href: 'https://www.reddit.com/r/CommissionMuktBharat/' },
  { id: 'discord', label: 'Discord', href: 'https://discord.gg/commissionmuktbharat' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590017357770' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029VbBqF7S5fM5Rf1mRV540' },
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/commissionmuktbharat' },
]

export const FOOTER_COLUMNS = [
  {
    title: 'The Movement',
    links: [
      { label: 'Vision', href: '/#vision' },
      { label: 'Articles', href: '/articles' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    title: 'Topics',
    links: [
      { label: 'Reports', href: '/reports' },
      { label: 'Issues', href: '/issues' },
      { label: 'News', href: '/news' },
      { label: 'Quotes', href: '/quotes' },
    ],
  },
  {
    title: 'Get involved',
    links: [
      { label: 'Join the movement', href: '/join' },
      { label: 'Members', href: '/members' },
      { label: 'Get your card', href: '/card' },
      { label: 'Raise your voice', href: '/issues' },
      { label: 'Volunteer', href: '/#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Press Kit', href: '/press' },
    ],
  },
]

export const FOOTER_BOTTOM_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/#contact' },
]
