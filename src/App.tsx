import React from 'react';
import {RouterProvider} from "react-router-dom";
import {router} from "./routers/RootRouter";
import {MantineProvider} from "@mantine/core";
import {theme} from "./config/theme";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';

function App() {

  return (
    <MantineProvider theme={theme} >
      <Notifications />
      <RouterProvider router={router}/>
    </MantineProvider>
  );
}

export default App;
