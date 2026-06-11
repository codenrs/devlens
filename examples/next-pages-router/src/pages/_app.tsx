import '@nrshagor/devlens-next/styles.css';
import '@/styles/globals.css';
import { NextDevLens } from '@nrshagor/devlens-next';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <NextDevLens defaultTheme="system" position="bottom-right" />
    </>
  );
}
