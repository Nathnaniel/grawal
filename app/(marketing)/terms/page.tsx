import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactEmail as Email, LegalPage, type LegalSection } from '@/components/landing/LegalPage';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms for using ${SITE_NAME}: your account, your wins, fair use and what we promise in return.`,
  robots: { index: true },
};

const SECTIONS: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    body: (
      <>
        <p>These terms are an agreement between you and {SITE_NAME} (“{SITE_NAME}”, “we”, “us”) for using the {SITE_NAME} website and app (“the service”). {SITE_NAME} is a private gratitude wall where you pin your wins and answered prayers and look back on them over time.</p>
        <p>By creating an account or using the service, you agree to these terms and to our <Link href="/privacy">Privacy Policy</Link>. If you don’t agree, please don’t use {SITE_NAME}.</p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Who can use Grawal',
    body: <p>You must be at least 13 years old to use {SITE_NAME}. If you’re under the age of majority where you live, you need a parent or guardian’s permission. By using the service, you confirm that you meet these requirements.</p>,
  },
  {
    id: 'your-account',
    title: 'Your account',
    body: (
      <>
        <p>You sign in with a one-time link sent to your email or with your Google account. You’re responsible for keeping access to that email or Google account secure, and for what happens on your {SITE_NAME} account.</p>
        <p>Please give us an email address you control, and tell us at <Email /> if you think someone else has got into your account.</p>
      </>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content',
    body: <p>Your wins, stories, reflections, photos and categories are your content.</p>,
    parts: [
      {
        id: 'you-own-it',
        title: 'You own it',
        body: <p>You keep all rights to your content. We don’t claim ownership of anything you put on your wall.</p>,
      },
      {
        id: 'what-you-let-us-do',
        title: 'What you let us do with it',
        body: <p>So the service can work, you give us permission to store, copy, process and display your content to you, and to make backups. This permission is only for running {SITE_NAME} for you, and it ends when you delete the content or your account (apart from backups, which are overwritten over time).</p>,
      },
      {
        id: 'your-responsibility',
        title: 'Your responsibility',
        body: <p>Only add content you have the right to add. That includes photos, and personal details about other people. Scripture references and quotations are your own entries; please respect the copyright terms of the Bible translation you quote.</p>,
      },
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>Please use {SITE_NAME} for what it’s for. You agree not to:</p>
        <ul>
          <li>Break any law, or use the service to harm, harass or deceive anyone.</li>
          <li>Upload content that’s illegal, infringes someone else’s rights, or contains malware.</li>
          <li>Try to get into other people’s accounts or data, or into our systems.</li>
          <li>Disrupt or overload the service, or get around its limits or security.</li>
          <li>Scrape, copy or resell the service, or use automated tools to access it beyond normal use.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'price',
    title: 'Price',
    body: <p>{SITE_NAME} is free to use today. If we introduce paid features, we’ll tell you the price and terms clearly first. You’ll never be charged without agreeing to it, and features you already use for free won’t start costing money without notice.</p>,
  },
  {
    id: 'third-party-services',
    title: 'Third-party services',
    body: <p>{SITE_NAME} runs on trusted providers: Supabase for the database, sign-in and file storage, Vercel for hosting, and Google if you sign in with Google. Their own terms apply to their services. Our <Link href="/privacy#how-we-share-information">Privacy Policy</Link> explains what each one handles.</p>,
  },
  {
    id: 'our-property',
    title: 'Our property',
    body: (
      <>
        <p>The {SITE_NAME} name, logo, design, illustrations and software belong to us and are protected by law. These terms don’t give you any right to use our brand or copy our service.</p>
        <p>If you send us ideas or feedback, we may use them to improve {SITE_NAME} without owing you anything. Thank you in advance.</p>
      </>
    ),
  },
  {
    id: 'availability',
    title: 'Availability and changes',
    body: <p>We work to keep {SITE_NAME} running smoothly and your wall safe, but we can’t promise the service will always be available or free of errors. We may change, add or remove features over time. If we ever decide to shut {SITE_NAME} down, we’ll give you reasonable notice and a way to get a copy of your wins first.</p>,
  },
  {
    id: 'ending',
    title: 'Ending your use',
    parts: [
      {
        id: 'by-you',
        title: 'By you',
        body: <p>You can stop using {SITE_NAME} at any time, and delete your account and all your content in <strong>Settings → Delete account</strong>.</p>,
      },
      {
        id: 'by-us',
        title: 'By us',
        body: <p>We may suspend or close an account that seriously or repeatedly breaks these terms, or where the law requires it. Where it’s reasonable, we’ll tell you first and give you a chance to get a copy of your content.</p>,
      },
    ],
    body: null,
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: <p>{SITE_NAME} is provided “as is” and “as available”. To the extent the law allows, we make no promises beyond those in these terms, including any implied promises that the service will meet a particular need. {SITE_NAME} is a personal journal. It isn’t professional, medical, financial or pastoral advice.</p>,
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <>
        <p>To the extent the law allows, {SITE_NAME} isn’t liable for indirect or consequential losses, or for loss of data, profits or goodwill, arising from your use of the service. Because the service is free, our total liability to you for any claim is limited to 100 US dollars.</p>
        <p>Nothing in these terms limits liability that can’t be limited by law, or takes away rights you have as a consumer where you live.</p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: <p>We may update these terms as {SITE_NAME} grows. We’ll change the date at the top, and for significant changes we’ll let you know in the app or by email before they take effect. If you keep using {SITE_NAME} after that, the new terms apply. If you don’t agree, you can delete your account.</p>,
  },
  {
    id: 'general',
    title: 'General',
    body: <p>If any part of these terms can’t be enforced, the rest still applies. If we don’t enforce a term straight away, we haven’t given up the right to do so later. These terms, together with the Privacy Policy, are the whole agreement between you and {SITE_NAME} about the service.</p>,
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: <p>Questions about these terms? Email <Email />.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`The terms for using ${SITE_NAME}: your account, your wins, fair use, and what we promise in return.`}
      sections={SECTIONS}
    />
  );
}
