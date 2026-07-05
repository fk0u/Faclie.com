import { UserIntent } from '@/types/chat';

export const parseUserIntent = (text: string): UserIntent => {
  const cleanText = text.toLowerCase().trim();

  // 1. Scope Creep Resistance (Highly critical in simulator gameplay)
  const scopeResistanceKeywords = [
    'out of scope', 'not in scope', 'extra charge', 'extra budget', 'not in contract',
    'require more budget', 'tambah biaya', 'di luar scope', 'diluar scope',
    'charge tambahan', 'fee tambahan', 'pay extra', 'cost more', 'additional cost',
    'tambah budget', 'invoice separately', 'new proposal', 'not agreed', 'not in the agreement',
    'charge a fee', 'extra fee'
  ];
  if (scopeResistanceKeywords.some(keyword => cleanText.includes(keyword))) {
    return 'scope_creep_resistance';
  }

  // 2. Scope Creep Acceptance
  const scopeAcceptanceKeywords = [
    'sure i can add', 'i can do that for free', 'no extra charge', 'free of charge',
    'i will do it', 'no problem', 'bisa saya tambahkan', 'ok saya buatkan',
    'gratis', 'free', 'i can add that', 'will include it', 'no worries, i\'ll add'
  ];
  if (scopeAcceptanceKeywords.some(keyword => cleanText.includes(keyword))) {
    return 'scope_creep_acceptance';
  }

  // 3. Price Negotiation / Financial Demands
  const priceNegotiationKeywords = [
    'deposit', 'down payment', ' dp ', 'payment', 'transfer', 'invoice', 'billing',
    'rate', 'cost', 'fee', 'charge', 'price', 'budget', 'tagihan', 'pembayaran',
    'bayar', 'rekening', 'invoice sent', 'send invoice'
  ];
  if (priceNegotiationKeywords.some(keyword => cleanText.includes(keyword))) {
    // If it also contains confrontation elements (demanding money)
    const confrontationKeywords = ['unpaid', 'late', 'delay', 'overdue', 'please pay', 'still waiting', 'belum bayar', 'tunggakan'];
    if (confrontationKeywords.some(k => cleanText.includes(k))) {
      return 'confrontation';
    }
    return 'price_negotiation';
  }

  // 4. Price Concession (Giving discount)
  const priceConcessionKeywords = [
    'discount', 'lower the rate', 'give a discount', 'cheapen', 'diskon',
    'murahin', 'potong harga', 'can do it for less', 'reduce price'
  ];
  if (priceConcessionKeywords.some(keyword => cleanText.includes(keyword))) {
    return 'price_concession';
  }

  // 5. Work Submission
  const submissionKeywords = [
    'draft', 'submission', 'deliverable', 'here is the link', 'completed',
    'finished', 'final build', 'ini link', 'sudah selesai', 'beres', 'mockup',
    'design is ready', 'here is the design', 'check this out', 'here are the files'
  ];
  if (submissionKeywords.some(keyword => cleanText.includes(keyword))) {
    return 'submission';
  }

  // 6. Compliment
  const complimentKeywords = [
    'thank you', 'thanks', 'great', 'awesome', 'nice', 'pleasure', 'excellent',
    'terima kasih', 'makasih', 'keren', 'mantap', 'suka', 'bagus', 'love it',
    'helpful', 'kind of you'
  ];
  if (complimentKeywords.some(keyword => cleanText.includes(keyword))) {
    return 'compliment';
  }

  // 7. Criticism / Defensiveness
  const criticismKeywords = [
    'wrong', 'not correct', 'incorrect', 'that is wrong', 'jelek', 'salah',
    'delay', 'slow', 'telat', 'lambat', 'not my fault'
  ];
  if (criticismKeywords.some(keyword => cleanText.includes(keyword))) {
    return 'criticism';
  }

  // 8. Greeting
  const greetingKeywords = [
    'hello', 'hi', 'morning', 'afternoon', 'evening', 'gm', 'halo', 'hey',
    'siang', 'sore', 'pagi', 'wassalamualaikum', 'assalamualaikum'
  ];
  if (greetingKeywords.some(keyword => cleanText.startsWith(keyword) || cleanText === keyword)) {
    return 'greeting';
  }

  // 9. Question
  if (cleanText.includes('?') || cleanText.startsWith('what') || cleanText.startsWith('how') || cleanText.startsWith('why') || cleanText.startsWith('apakah') || cleanText.startsWith('bagaimana')) {
    return 'question';
  }

  return 'unknown';
};
