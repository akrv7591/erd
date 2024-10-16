import {MantineProvider} from "@mantine/core";
import {theme} from "./config/theme";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {HelmetProvider} from 'react-helmet-async';
import {LogtoProvider} from "@logto/react";
import {config} from "@/config/config.ts";
import {Router} from "@/routers/Router.tsx";
import {memo} from "react";

const queryClient = new QueryClient()

export const App = memo(() => {
  return (
    <LogtoProvider config={config.logTo} unstable_enableCache={true}>
        <QueryClientProvider client={queryClient} >
          <MantineProvider theme={theme} defaultColorScheme={"dark"}>
            <Notifications position={"bottom-right"}/>
            <HelmetProvider>
              <Router />
            </HelmetProvider>
          </MantineProvider>
        </QueryClientProvider>
    </LogtoProvider>
  );
})
