import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
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

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>View Listening Stats &rarr;</h3>
            <p>View analytics on your listening patterns.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
