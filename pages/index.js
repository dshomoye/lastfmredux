import Head from "next/head";
import Link from "next/link";

import PageContainer from "../components/PageContainer";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <PageContainer page="HOME">
      <Head>
        <title>LastFM Redux</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className="text-4xl hover:text-red-600">🎵 LastFM Redux! 🎵</h1>
        <div className={styles.grid}>
          <Link href="/update">
            <a className={styles.card}>
              <h3>Update scrobbles &rarr;</h3>
              <p>Pull scrobbles from LastFM</p>
            </a>
          </Link>
          <Link href="/stats">
            <a className={styles.card}>
              <h3>View Stats &rarr;</h3>
              <p>See listening patterns for user.</p>
            </a>
          </Link>
        </div>
      </main>
    </PageContainer>
  );
}
