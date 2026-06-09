// Tiny rule-based assistant. Answers are drawn straight from the site's own
// content (FAQs, the five demands, sectors & motive) — no backend, no LLM.
// getBotReply() scores each topic by keyword hits and returns the best match.
import { FAQS } from './faqs'

const KB = [
  {
    keywords: ['hi', 'hii', 'hello', 'hey', 'namaste', 'namaskar', 'hola', 'start'],
    answer: "Namaste! 🙏 I'm the Commission-Mukt Bharat assistant. Ask me about the movement, the five demands, unfair commissions, or how to join.",
  },
  {
    keywords: ['what is', 'about', 'cmb', 'commission-mukt', 'commission mukt', 'movement', 'who are you', 'explain'],
    answer: FAQS[0].a,
  },
  {
    keywords: ['why', 'name', 'called', 'mukt', 'meaning'],
    answer: FAQS[1].a,
  },
  {
    keywords: ['demand', 'demands', 'five', '5 demands', 'manifesto', 'asks', 'agenda'],
    answer: FAQS[2].a,
  },
  {
    keywords: ['join', 'member', 'membership', 'register', 'sign up', 'signup', 'become', 'how do i join'],
    answer: FAQS[3].a + ' 👉 Just open the Join page (/join) — you can sign in with Google or fill the short form.',
  },
  {
    keywords: ['political', 'party', 'election', 'vote', 'politics', 'mla', 'mp'],
    answer: FAQS[4].a,
  },
  {
    keywords: ['free', 'fee to join', 'cost', 'price to join', 'paid', 'charge to join', 'donation'],
    answer: FAQS[5].a,
  },
  {
    keywords: ['headquarter', 'headquarters', 'office', 'located', 'location', 'address', 'hq'],
    answer: FAQS[6].a,
  },
  {
    keywords: ['who runs', 'leader', 'founder', 'head', 'owner', 'ceo'],
    answer: FAQS[7].a,
  },
  {
    keywords: ['commission', 'platform fee', 'convenience fee', 'surge', 'charge', 'charges', 'fees', 'fee', 'bill', 'hidden'],
    answer:
      'A commission is the cut apps take from every order, ride and delivery — plus platform, convenience, surge and handling fees stacked on top. You pay more, while the restaurant, rider or driver keeps less. We want every bill fully itemised and those unfair fees capped or banned. A fair bill, for a fair Bharat.',
  },
  {
    keywords: ['rider', 'riders', 'driver', 'drivers', 'cab', 'delivery', 'payout', 'gig', 'worker', 'workers', 'empower'],
    answer:
      'Riders, cab drivers and gig workers do the work while a heavy commission quietly disappears from their pay. We stand for fair, transparent payouts (at least 80% of what the customer pays), safety and dignity — no silent deactivation, no opaque deductions.',
  },
  {
    keywords: ['food', 'restaurant', 'kirana', 'zomato', 'swiggy', 'app', 'seller', 'shop', 'business'],
    answer:
      'Restaurants, kiranas and small sellers lose a big slice of every order to platform commissions and fees. We demand a commission cap (no more than 10% on restaurants) so honest kitchens survive and food stays affordable.',
  },
  {
    keywords: ['article', 'articles', 'blog', 'essay', 'essays', 'news', 'post', 'story', 'write'],
    answer: 'Read our essays — and post your own (with a photo or video) — on the Articles page (/articles). Every post gets its own comment thread.',
  },
  {
    keywords: ['issue', 'issues', 'complaint', 'problem', 'raise', 'report', 'voice'],
    answer: 'Raise a problem or upvote others on the Issues page (/issues). Real problems, real India — your voice counts.',
  },
  {
    keywords: ['contact', 'email', 'reach', 'support', 'help', 'press'],
    answer: 'You can reach the movement through the Contact section on the home page. Press and member correspondence is handled there.',
  },
  {
    keywords: ['thank', 'thanks', 'thankyou', 'thank you', 'dhanyavaad', 'shukriya', 'great', 'awesome'],
    answer: 'Anytime! 🙌 Together for fair pricing and transparent platforms — a fair bill, for a fair Bharat. 🇮🇳',
  },
]

const FALLBACK =
  "I'm still learning! Try asking about the five demands, unfair commissions, riders & gig workers, or how to join. You can also raise it on the Issues page (/issues) or join at /join. A fair bill, for a fair Bharat. 🇮🇳"

export function getBotReply(message) {
  const text = ` ${message.toLowerCase().trim()} `
  let best = null
  let bestScore = 0
  for (const entry of KB) {
    let score = 0
    for (const kw of entry.keywords) {
      if (text.includes(kw)) score += kw.includes(' ') ? 2 : 1 // phrase matches weigh more
    }
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  return best ? best.answer : FALLBACK
}

export const CHAT_WELCOME =
  "Namaste! 🙏 I'm the CMB assistant. Ask me about the movement, the five demands, unfair commissions, riders & gig workers, or how to join."

export const CHAT_SUGGESTIONS = ['What is CMB?', 'The five demands', 'How do I join?', 'What is a commission?']
