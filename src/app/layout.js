
import "./globals.css";

import localFont from "next/font/local"
import { AuthProvider } from '@/context/AuthContext';

const vazir = localFont({
  src: "../fonts/Vazir.ttf",
  variable: "--font-vazir",
})

export const metadata = {
  title: 'درمان تروما',
  description: 'اپلیکیشن درمان تروما با تست‌های روانشناسی',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
    <body>
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
  </html>

  )
}



// export default function RootLayout({ children }) {
//   return (
//     <html
//       lang="en"
//       // className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">{children}</body>
//     </html>
//   );
// }
