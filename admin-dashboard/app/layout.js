import './globals.css';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Crestfield Academy - Admin Dashboard',
  description: 'Application Management System for Crestfield Online Homeschool',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
