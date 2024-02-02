import {Helmet} from "react-helmet-async";
import {AppShell, Container} from "@mantine/core";
import Header from "@/components/common/Header/Header.tsx";

export default function PrivacyPolicy() {
  return (
    <AppShell
      header={{height: 50}}>
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Container py={"50px"}>
          <Helmet>
            <title>Privacy Policy for erdiagram.akrv.dev</title>
          </Helmet>
          <header>
            <h1>Privacy Policy for erdiagramly.akrv.dev</h1>
            <p>Effective Date: 2023.12.14</p>
          </header>

          <section>
            <h2>1. Information We Collect</h2>

            <section>
              <h3>1.1 Personal Information</h3>
              <p>When you use Google OAuth for authentication on erdiagramly.akrv.dev, we may collect and store certain
                personal information:</p>
              <ul>
                <li><strong>Name:</strong> To personalize your experience.</li>
                <li><strong>Email Address:</strong> To communicate with you and provide important updates.</li>
                <li><strong>Profile Picture:</strong> To enhance user recognition.</li>
              </ul>
            </section>

            <section>
              <h3>1.2 Usage Data</h3>
              <p>We may collect non-personal information about how you interact with our website. This may include:</p>
              <ul>
                <li><strong>IP Address:</strong> To analyze trends and administer the site.</li>
                <li><strong>Browser Type:</strong> To enhance user experience.</li>
                <li><strong>Device Information:</strong> To optimize our services for your device.</li>
              </ul>
            </section>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>Authentication:</strong> To identify and authenticate users via Google OAuth.</li>
              <li><strong>Communication:</strong> To send important updates, notifications, and respond to inquiries.
              </li>
              <li><strong>Improvement:</strong> To analyze user behavior and improve our website and services.</li>
            </ul>
          </section>

          <footer>
            <p>Thank you for trusting erdiagramly.akrv.dev!</p>
            <p>If you have any questions regarding this privacy policy, please contact us at <a
              href="mailto:akrv7591@email.com">akrv7591@email.com</a>.</p>
          </footer>
        </Container>
      </AppShell.Main>
    </AppShell>

  )
}
