import "./globals.css";

export const metadata = {
  title: "SPV Chat",
  description: "Social feed and direct messaging for the SPV ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}