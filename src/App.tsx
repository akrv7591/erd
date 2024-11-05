import {MantineProvider} from "@mantine/core";
import {theme} from "./config/theme";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {HelmetProvider} from 'react-helmet-async';
import {LogtoProvider} from "@logto/react";
import {config} from "@/config/config";
import {Router} from "@/routers/Router";

const queryClient = new QueryClient()

export const App = () => {
  return (
    <LogtoProvider config={config.logTo}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme={"dark"}>
          <Notifications position={"bottom-right"}/>
          <HelmetProvider>
            <Router/>
          </HelmetProvider>
        </MantineProvider>
      </QueryClientProvider>
    </LogtoProvider>
  );
}
