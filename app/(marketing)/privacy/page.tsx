import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactEmail as Email, LegalPage, legalViewport, LegalTable as Table, type LegalSection } from '@/components/landing/LegalPage';
import { SITE_NAME } from '@/lib/site';

export const viewport = legalViewport;

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} handles your wins, your account and your data, and the choices you have.`,
  robots: { index: true },
};

// What the policy says must match what the app does. If the app starts collecting
// something new (analytics, payments, a new provider), update this page and LEGAL_UPDATED.
const SECTIONS: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: (
      <>
        <p>{SITE_NAME} (“{SITE_NAME}”, “we”, “us”) is a private gratitude wall: a place to pin your wins and answered prayers and look back on them over the years. This policy explains what we collect when you use the {SITE_NAME} website and app, why, who helps us run it, and the choices you have.</p>
        <p>The short version: your wall is yours. Your wins are private to you, we don’t sell your data, we don’t show ads, and you can delete everything at any time.</p>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    body: <p>We only collect what we need to give you a working wall.</p>,
    parts: [
      {
        id: 'account',
        title: 'Your account',
        body: (
          <ul>
            <li><strong>Email address:</strong> used to sign you in with a one-time email link and to identify your account.</li>
            <li><strong>Google sign-in:</strong> if you choose Continue with Google, Google shares your name, email address and profile picture with us. We never see your Google password.</li>
            <li><strong>Profile:</strong> the name, profile photo, time zone and reminder preferences you set in Settings.</li>
          </ul>
        ),
      },
      {
        id: 'your-wall',
        title: 'Your wins',
        body: (
          <>
            <p>Everything you add to your wall: each win’s title, story or reflection, category, date, scripture reference, any photo you attach, and whether it’s pinned or on the wall. We also store the custom categories you create.</p>
            <p>Your wins are private. Only you can see them when you’re signed in. {SITE_NAME} doesn’t have public sharing today; if we add it, nothing will be shared unless you choose to share a specific win.</p>
          </>
        ),
      },
      {
        id: 'sign-in-records',
        title: 'Sign-in and security records',
        body: <p>When you sign in, our authentication provider records the time, your IP address and your browser or device type. We use these records to keep accounts secure, stop abuse and understand roughly where people use {SITE_NAME} from. Our hosting provider also keeps short-lived server logs (such as IP address and pages requested) to run and protect the site.</p>,
      },
      {
        id: 'on-your-device',
        title: 'Stored on your device',
        body: (
          <ul>
            <li><strong>Sign-in cookies</strong> keep you signed in. They’re essential, so the site can’t work without them.</li>
            <li><strong>Your theme choice</strong> (light, dark or system) is saved in your browser.</li>
            <li><strong>Wins waiting to save:</strong> if you add a win while offline, it’s kept in your browser until it can be saved to your wall.</li>
          </ul>
        ),
      },
      {
        id: 'what-we-dont-collect',
        title: 'What we don’t collect',
        body: (
          <ul>
            <li>No advertising or tracking cookies, and no third-party analytics.</li>
            <li>No payment details: {SITE_NAME} is free to use today.</li>
            <li>The try-it demo on our home page saves nothing. What you type there disappears when you leave the page.</li>
          </ul>
        ),
      },
    ],
  },
  {
    id: 'how-we-use-information',
    title: 'How we use information',
    body: (
      <>
        <Table
          head={['Purpose', 'Information used']}
          rows={[
            ['Sign you in and keep you signed in', 'Email address, Google profile, sign-in cookies'],
            ['Show and save your wall', 'Your wins, categories and photos'],
            ['Show dates and reminders in your time', 'Time zone, reminder preferences'],
            ['Keep accounts and the site secure', 'Sign-in records, server logs'],
            ['Answer you when you write to us', 'Your email and message'],
          ]}
        />
        <p>We don’t use your wins for advertising, we don’t build profiles of you, and we don’t use your content to train AI models.</p>
      </>
    ),
  },
  {
    id: 'how-we-share-information',
    title: 'How we share information',
    body: (
      <>
        <p>We don’t sell, rent or trade your information. We share it only with the services that run {SITE_NAME} for us, and only so they can do that job:</p>
        <Table
          head={['Provider', 'What they handle', 'Why']}
          rows={[
            ['Supabase', 'Your account, wins, photos and sign-in records', 'Database, sign-in and file storage'],
            ['Vercel', 'Web requests and server logs', 'Hosting the website and app'],
            ['Google', 'Your Google sign-in, if you use it', 'Continue with Google'],
            ['Our email provider', 'Your email address', 'Sending your sign-in links'],
          ]}
        />
        <p>Each provider handles data under its own privacy policy and security commitments. We may also share information if the law requires it, or if it’s needed to protect someone’s safety or our rights.</p>
      </>
    ),
  },
  {
    id: 'storage-and-retention',
    title: 'Storage and retention',
    body: (
      <>
        <p>Your wall is stored with Supabase. Photos are kept in private storage and are only shown through short-lived links created for you.</p>
        <Table
          head={['Information', 'How long we keep it']}
          rows={[
            ['Your account and profile', 'Until you delete your account'],
            ['Your wins, categories and photos', 'Until you delete them or your account'],
            ['Sign-in records and server logs', 'As long as our providers keep them for security, usually a few weeks to a few months'],
            ['Backups, if any', 'Overwritten on our provider’s schedule, usually within 30 days'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'your-rights-and-choices',
    title: 'Your rights and choices',
    body: <p>Depending on where you live, you may have the right to access, correct, delete or receive a copy of your information, or to object to how it’s used. You can do most of this yourself:</p>,
    parts: [
      {
        id: 'delete',
        title: 'Delete your account',
        body: <p>Go to <strong>Settings → Delete account</strong>. This immediately and permanently removes your account, every win, your categories and your photos. It can’t be undone.</p>,
      },
      {
        id: 'edit',
        title: 'Change or remove wins',
        body: <p>You can edit or delete any win, take it off your wall, and change your name, photo, time zone and reminders in Settings at any time.</p>,
      },
      {
        id: 'copy',
        title: 'Get a copy of your data',
        body: <p>A download of your wall is on our list. Until it’s ready, email <Email /> and we’ll send you a copy.</p>,
      },
      {
        id: 'other-requests',
        title: 'Other requests',
        body: <p>For anything else, or to complain about how we handle your data, email <Email />. You can also contact your local data protection authority.</p>,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <>
        <p>We protect your information with:</p>
        <ul>
          <li>Encrypted connections (HTTPS) for everything you send and receive.</li>
          <li>Database rules that only let each person read and change their own wall.</li>
          <li>Private photo storage, with access through short-lived links.</li>
          <li>Passwordless sign-in, so there’s no {SITE_NAME} password to steal.</li>
        </ul>
        <p>No service can promise perfect security. If we learn of a breach that affects your information, we’ll tell you without undue delay.</p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    title: 'International transfers',
    body: <p>Our providers may store or process information in countries other than yours, including the United States. Where this happens, we rely on their safeguards for international transfers, such as standard contractual clauses.</p>,
  },
  {
    id: 'children',
    title: 'Children',
    body: <p>{SITE_NAME} isn’t meant for children under 13, and we don’t knowingly collect their information. If you believe a child has given us information, email <Email /> and we’ll delete it.</p>,
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>If we change this policy, we’ll update the date at the top. If a change is significant, we’ll let you know in the app or by email before it takes effect.</p>,
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: <p>Questions about your privacy or your data? Email <Email />. See also our <Link href="/terms">Terms of Service</Link>.</p>,
  },
  {
    id: 'summary',
    title: 'Summary',
    body: (
      <>
        <p>For quick reference, here’s what {SITE_NAME} does and doesn’t do with your data:</p>
        <div className="legal-table">
          <table>
            <thead><tr><th scope="col"></th><th scope="col">Yes</th><th scope="col">No</th></tr></thead>
            <tbody>
              {([
                ['Keeps your wins private to you', true],
                ['Lets you delete everything at any time', true],
                ['Records sign-ins for security', true],
                ['Sells your data', false],
                ['Shows ads or uses tracking cookies', false],
                ['Uses your wins to train AI', false],
                ['Shares your wins publicly', false],
              ] as const).map(([label, yes]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="yes">{yes ? '✓' : ''}</td>
                  <td className="no">{yes ? '' : '✕'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`How ${SITE_NAME} handles your wins and your account: what we collect, who helps us run the app, and how to see, change or delete your data.`}
      sections={SECTIONS}
    />
  );
}
