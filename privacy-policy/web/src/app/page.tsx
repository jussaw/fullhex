const LAST_UPDATED = 'June 13, 2026';
const CONTACT_EMAIL = 'justin@jussaw.com';

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-9 shadow-sm sm:px-10 sm:py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">FullHex — Privacy Policy</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <p className="mb-8">
          FullHex (&ldquo;the extension&rdquo;) is a browser extension that removes the blank
          ad-space gutters on <strong>colonist.io</strong> and resizes the game board to fill your
          browser window.
        </p>

        <Section title="Summary">
          <p>
            <strong>FullHex does not handle any user data.</strong> It does not collect, store, use,
            transmit, sell, or share personal or sensitive user data of any kind. In accordance with
            the Chrome Web Store User Data Policy, we confirm that this extension does not handle
            user data.
          </p>
        </Section>

        <Section title="What information we collect">
          <p>
            <strong>None.</strong> FullHex collects no personal or sensitive user data &mdash; no
            personally identifiable information, no authentication data, no financial or payment
            data, no form data, no website content, and no web browsing activity. It sets no
            cookies, uses no analytics or trackers, makes no network requests, and loads no remote
            code.
          </p>
        </Section>

        <Section title="How we use information">
          <p>
            Because FullHex collects no user data, there is no user data for it to use. The
            extension&rsquo;s only action is to restyle and resize the colonist.io game page
            locally, inside your browser.
          </p>
        </Section>

        <Section title="What information we share">
          <p>
            <strong>None, with no one.</strong> Because no user data is collected, no user data is
            shared, sold, or transferred to any party. There are no third parties that receive user
            data from FullHex.
          </p>
        </Section>

        <Section title="What the extension does and where it runs">
          <p>
            FullHex runs <strong>only on colonist.io</strong>. Its sole function is to adjust the
            layout of the colonist.io game page &mdash; hiding the empty ad gutters and resizing the
            board &mdash; entirely within your browser. It does not read, record, or transmit the
            contents of any page.
          </p>
        </Section>

        <Section title="Permissions">
          <p>
            FullHex requests only the narrowest access needed to restyle the colonist.io page (host
            access limited to colonist.io). It does not request access to your browsing history,
            your data on other websites, or any personal information.
          </p>
        </Section>

        <Section title="Data security and retention">
          <p>FullHex stores and transmits no user data, so there is none to secure or retain.</p>
        </Section>

        <Section title="Not affiliated with colonist.io">
          <p>
            FullHex is an independent project and is{' '}
            <strong>not affiliated with, endorsed by, or connected to colonist.io</strong> in any
            way.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If this policy changes, the updated version will be posted at this URL with a new
            &ldquo;Last updated&rdquo; date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-[var(--color-accent)] underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-2 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="text-[var(--color-text-secondary)]">{children}</div>
    </section>
  );
}
