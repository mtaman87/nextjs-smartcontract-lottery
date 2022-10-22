import Head from "next/head"

import styles from "../styles/Home.module.css"

import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className='dark:bg-slate-800 flex-1 flex-col justify-around items-center h-screen'>
            <Head>
                <title>Smart Contract Lotto</title>
                <meta name="description" content="Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
