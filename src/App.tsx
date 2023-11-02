import React from 'react';
import {RouterProvider} from "react-router-dom";
import {router} from "./routers/RootRouter";
import {MantineProvider} from "@mantine/core";
import {theme} from "./config/theme";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import {QueryClient, QueryClientProvider} from "react-query";
import {HelmetProvider} from 'react-helmet-async';
// import {CookiesProvider} from "react-cookie";

const queryClient = new QueryClient()

function App() {
  return (
    // <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme={"dark"}>
          <Notifications position={"top-right"}/>
          <HelmetProvider>
            <RouterProvider router={router}/>
          </HelmetProvider>
        </MantineProvider>
      </QueryClientProvider>
    // </CookiesProvider>
  );
}

export default App;
