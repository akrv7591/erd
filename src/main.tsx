import ReactDOM from 'react-dom/client';
// import {StrictMode} from "react";
// core styles are required for all packages
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import {App} from './App';
import "./main.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App/>
  // </StrictMode>,
)
