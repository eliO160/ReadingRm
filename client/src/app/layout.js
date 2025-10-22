//default layout for the app, defines structure/outer shell of the app (things that stay consistent across pages)
import './globals.css';
import { ThemeProvider } from 'next-themes';
import SiteHeader from '../components/SiteHeader';

export const metadata = { title: 'ReadingRm' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          <SiteHeader />

          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
 