// Every word on the landing page, as set in Figma (Jummai, node 2919:5185).

export type NoteColour = 'yellow' | 'white' | 'pink' | 'blue';
export interface SampleNote { category: string; story: string; colour: NoteColour }

export const WALL_NOTES: SampleNote[] = [
  { category: 'Answered Prayer', colour: 'yellow', story: 'Got the job offer I prayed about for three months. God came through right on time.' },
  { category: 'Family', colour: 'white', story: 'Mum’s surgery went well and she’s home recovering. So grateful.' },
  { category: 'Work', colour: 'yellow', story: 'Landed my first international client today. Never thought this would happen.' },
  { category: 'Faith', colour: 'pink', story: 'Read through the whole book of Psalms this month. My heart feels full.' },
  { category: 'Finances', colour: 'yellow', story: 'Cleared my last debt payment. Debt-free, by His grace.' },
  { category: 'Health', colour: 'yellow', story: 'Ran my first 5K without stopping. Strength I didn’t know I had.' },
  { category: 'Studies', colour: 'pink', story: 'Passed my final exams. Every late night was worth it.' },
  { category: 'Work', colour: 'white', story: 'Launched my side project after a year of building. It’s finally live.' },
  { category: 'Answered Prayer', colour: 'white', story: 'Travelled safely home after a long, difficult journey. God kept us all the way.' },
  { category: 'Family', colour: 'blue', story: 'Our baby took her first steps today. Thank you, Lord, for this gift.' },
  { category: 'Answered Prayer', colour: 'white', story: 'My visa was approved after months of waiting. Doors I couldn’t open, God opened.' },
  { category: 'Work', colour: 'pink', story: 'Got promoted today. Two years of quiet, faithful work finally seen.' },
  { category: 'Family', colour: 'blue', story: 'Reconnected with my brother after a long silence. Healing is real.' },
  { category: 'Health', colour: 'yellow', story: 'Test results came back clear. Breathing easy and thanking God.' },
  { category: 'Faith', colour: 'blue', story: 'Led worship at church for the first time. My hands shook, but He held me.' },
];

export const SCRIPTURES = [
  {
    quote: '“Bless the LORD, O my soul, and forget not all his benefits.”',
    reference: 'Psalm 103:2',
    title: 'Never Forget What He Has Done',
    art: '/landing/pattern-diamond.svg',
    background: '#8b70fd',
    text: '#fff',
    artTop: 180,
    artHeight: 240,
    mobileQuoteWidth: 264,
    mobileArtTop: 136,
  },
  {
    quote: '“O give thanks unto the LORD, for he is good: for his mercy endureth for ever.”',
    reference: 'Psalm 107:1',
    title: 'His Goodness Lasts Forever',
    art: '/landing/pattern-sphere.svg',
    background: '#e12d0d',
    text: '#fff',
    artTop: 180,
    artHeight: 240,
    mobileQuoteWidth: 241,
    mobileArtTop: 136,
  },
  {
    quote: '“In every thing give thanks: for this is the will of God in Christ Jesus concerning you.”',
    reference: '1 Thessalonians 5:18',
    title: 'Give Thanks in Everything',
    art: '/landing/pattern-hexagon.svg',
    background: '#f5f5f5',
    text: '#1a1a1a',
    artTop: 162.51,
    artHeight: 274.98,
    mobileQuoteWidth: 316,
    mobileArtTop: 117,
  },
];

export const STEPS = [
  {
    icon: '/landing/step-pin.svg',
    title: 'Pin your win',
    body: 'Something good happened? Write it down in seconds: an answered prayer, a breakthrough, a small win. Add a scripture or photo if you like, then pin it to your wall.',
  },
  {
    icon: '/landing/step-note.svg',
    title: 'Watch your wall grow',
    body: 'Every win stays on your wall, safe and private. Day by day, your wall becomes a living record of God’s faithfulness.',
  },
  {
    icon: '/landing/step-pray.svg',
    title: 'Look back and give thanks',
    body: 'When life feels slow, scroll back through the months and years. “On this day” and your yearly recap bring past wins back, so you remember how far you’ve come.',
  },
];

// The questions are from Figma. Its answer layer is one placeholder sentence, so these
// answers are written to match what the app does today.
export const FAQS = [
  {
    question: 'Is it free?',
    answer: 'Yes. Writing and pinning wins, your wall and looking back year by year are free. Extras such as photos may become part of a paid plan later.',
  },
  {
    question: 'Who can see my wall?',
    answer: 'Only you. Your wall is private, and no one else can read your wins.',
  },
  {
    question: 'What counts as a win?',
    answer: 'Anything you’re thankful for: an answered prayer, a breakthrough at work, good news from the doctor or a quiet moment of peace. Big or small, it belongs on your wall.',
  },
  {
    question: 'Can I add wins from the past?',
    answer: 'Yes. Choose the date when you add a win, and it takes its place in that month and year.',
  },
  {
    question: 'Can I use it on my phone?',
    answer: 'Yes. Grawal works in your phone’s browser, and you can add it to your home screen like an app.',
  },
  {
    question: 'Can I download or delete my wins?',
    answer: 'You can delete any win at any time. Downloading your whole wall as a PDF or CSV is coming soon.',
  },
];
