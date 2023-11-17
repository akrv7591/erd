import ReactDOM from 'react-dom/client';
import App from './App';
// core styles are required for all packages
import '@mantine/core/styles.css';
import "./main.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App/>
  // </React.StrictMode>,
)
