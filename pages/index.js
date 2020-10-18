import Head from "next/head";
import Link from "next/link";

import PageContainer from "../components/PageContainer";
import styles from "../styles/Home.module.css";

const cardStyle = "flex-initial p-8 m-5 border-2 border-gray-700 rounded-lg items-center transform hover hover:translate-y-2 hover:p-5 hover:text-blue-600 hover:border-blue-600 hover:shadow-lg transistion-all duration-500"

export default function Home() {
  return (
    <PageContainer page="HOME">
      <Head>
        <title>LastFM Redux</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className="text-4xl hover:text-blue-800 transition-all duration-700 ease-in-out transform hover:translate-y-2 hover:text-5xl">🎵 LastFM Redux! 🎵</h1>
        <div className="flex flex-no-wrap">
          <Link href="/update">
            <a className={cardStyle}>
              <h3 className="text-2xl">Update scrobbles &rarr;</h3>
              <p>Pull scrobbles from LastFM</p>
            </a>
          </Link>
          <Link href="/stats">
            <a className={cardStyle}>
              <h3 className="text-2xl">View Stats &rarr;</h3>
              <p>See listening patterns for user.</p>
            </a>
          </Link>
        </div>
      </main>
    </PageContainer>
  );
}
