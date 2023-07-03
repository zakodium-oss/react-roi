import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
);

export { RoiComponent } from './components/RoiComponent';
export * from './types/index';
