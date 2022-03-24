import type { AppProps } from 'next/app'

import "focus-visible"
import '../styles/globals.css'
import { NavBar } from '../components/NavBar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
