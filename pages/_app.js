import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (<>
    <Head>
    <meta name="viewport" content="width=device-width, initial-scale=0.8, maximum-scale=1" />
    <link rel="icon" href="/logo.jpeg" />
      <title>The Coder's Nirvana</title>
    </Head>
  <Component {...pageProps} />
  </>)
}

export default MyApp
