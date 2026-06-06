import '@codenrs/devlens-ui/styles/devlens.css';
import '@/styles/globals.css';
import { NextDevLens } from '@codenrs/devlens-next';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <NextDevLens defaultTheme="system" position="bottom-right" />
    </>
  );
}
