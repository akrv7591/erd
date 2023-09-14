import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// core styles are required for all packages
import '@mantine/core/styles.css';
import {createTheme, MantineProvider, Tooltip} from "@mantine/core";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const theme = createTheme({
  components: {
    Tooltip: Tooltip.extend({
      defaultProps: {
        transitionProps: {
          transition: "pop",
          duration: 300
        }
      }
    })
  }
})
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme={"dark"}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
