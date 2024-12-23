import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import NetworkStatus from './pages/NetworkStatus';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <NetworkStatus>
          <App />
        </NetworkStatus>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
