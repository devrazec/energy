import './globals.css';
import { GlobalProvider } from './context/GlobalContext';
import Providers from './providers';
import Loading from './components/Loading';
import RouteChangeListener from './components/RouteChangeListener';

export const metadata = {
  title: 'ENERGY DASHBOARD',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <Providers>
            <RouteChangeListener />
            <Loading />
            {children}
          </Providers>
        </GlobalProvider>
      </body>
    </html>
  );
}
