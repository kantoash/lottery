import Head from 'next/head'
import Connect from '../components/Connect'
import LotteryEntrance from '../components/LotteryEntrance'



export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <Connect/>
     <LotteryEntrance/>
    </div>
  )
}