import {Helmet} from "react-helmet-async";
import {AppShell, Container, Title} from "@mantine/core";
import Header from "@/components/layouts/HomeLayout/Header";

export default function TermsOfService() {
  return (
      <AppShell
        header={{height: 50}}>
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Container py={"lg"}>
            <Helmet>
              <title>Terms of Service for erdiagramly.akrv.dev</title>
            </Helmet>
            <header>
              <Title order={3}>Terms of Service for erdiagramly.akrv.dev</Title>
              <p>Effective Date: [Date]</p>
            </header>

            <section>
              <Title order={2}>1. Acceptance of Terms</Title>
              <p>By using erdiagramly.akrv.dev, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use our website.</p>
            </section>

            <section>
              <Title order={2}>2. Use of Services</Title>
              <p>You agree to use the services provided by erdiagramly.akrv.dev in accordance with applicable laws and regulations and not to misuse the services in any way that could harm the website or its users.</p>
            </section>

            <section>
              <Title order={2}>3. User Responsibilities</Title>
              <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
            </section>

            <footer>
              <p>Thank you for using erdiagramly.akrv.dev!</p>
              <p>If you have any questions regarding these terms, please contact us at <a href="mailto:akrv7591@gmail.com">akrv7591@gmail.com</a>.</p>
            </footer>
          </Container>
        </AppShell.Main>
      </AppShell>
  )
}
