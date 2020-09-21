import Head from "next/head";
import BarWeekly from '../components/BarWeekly'
import styles from '../styles/stats.module.css'

const Stats = () => {
  return (
    <div>
      <Head>
        <title>View Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles['page-container']}>
          <BarWeekly />
        </div>
      </main>
    </div>
  )
}

export default Stats;
