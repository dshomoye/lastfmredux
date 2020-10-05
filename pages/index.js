import Head from 'next/head'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>LastFM Redux</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to LastFM Redux!
        </h1>

        <div className={styles.grid}>
          <a href="/update" className={styles.card}>
            <h3>Update scrobbles &rarr;</h3>
            <p>Pull latest scrobbles from LastFM</p>
          </a>

          <a href="/stats" className={styles.card}>
            <h3>View Listening Stats &rarr;</h3>
            <p>View analytics on your listening patterns.</p>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
