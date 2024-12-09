import {AppShell, Button, Group} from "@mantine/core";
import {Header} from "@/components/common/Header";
import {IconBooks} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {Hero} from "@/screens/Home/Hero/Hero";

export default function Home() {
  return (
    <AppShell
      header={{height: 60}}
    >
      <AppShell.Header>
        <Header>
          <Group flex={1} justify={"flex-end"}>
            <Link to={"/library"} state={{destination: "/library"}}>
              <Button
                size={"sm"}
                leftSection={<IconBooks size={"20"}/>}
                variant={"subtle"}
                color={"var(--mantine-color-text)"}
              >
                Library
              </Button>
            </Link>
          </Group>
        </Header>
      </AppShell.Header>
      <AppShell.Main p={0} pt={"60"}>
        <Hero />
      </AppShell.Main>
    </AppShell>

  );
}
