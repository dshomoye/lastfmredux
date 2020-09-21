import Head from "next/head";
import BarWeekly from '../components/BarWeekly'

const VizContainer = ({children}) => <div className="flex-initial w-full h-56 lg:w-1/2 my-8">{children}</div>

const Stats = () => {
  return (
    <div>
      <Head>
        <title>View Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container my-32">
        <div className="flex flex-wrap">
          <VizContainer>
            <h4>Top 3 songs/week.</h4>
            <BarWeekly />
          </VizContainer>
          <VizContainer>
            <BarWeekly />
          </VizContainer>
        </div>
      </main>
    </div>
  )
}

export default Stats;
