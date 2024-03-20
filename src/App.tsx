import {RouterProvider} from "react-router-dom";
import {router} from "./routers/RootRouter";
import {MantineProvider} from "@mantine/core";
import {theme} from "./config/theme";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {HelmetProvider} from 'react-helmet-async';
import {GoogleOAuthProvider} from "@react-oauth/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    }
  }
})

function App() {
  return (
    <GoogleOAuthProvider clientId="316029761884-vs47r1pnkor2ev4lvev7mt54te06154t.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme={"dark"}>
          <Notifications position={"top-right"}/>
          <HelmetProvider>
            <RouterProvider router={router}/>
          </HelmetProvider>
        </MantineProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
