import "bootstrap/dist/css/bootstrap.min.css"
import "./styles.css";

export const metadata = {
  title: "Meme COin Generator",
  description: "Generate your memecoin in 1 minute without any coding",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
