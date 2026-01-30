import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Architect | Optimize Your Resume for Any Job",
  description:
    "Transform your resume with AI-powered optimization. Get tailored resumes that match job descriptions perfectly and pass ATS systems.",
  keywords: ["resume", "CV", "AI", "job search", "ATS", "career"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
