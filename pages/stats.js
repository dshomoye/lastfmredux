import Head from "next/head";
import TopSongsChart from "../components/TopSongsChart";

const VizContainer = ({ children }) => (
  <div className="flex-initial w-full h-56 lg:w-1/2 my-8 overflow-visible">
    {children}
  </div>
);

const Stats = () => {
  return (
    <div>
      <Head>
        <title>View Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div className="flex flex-wrap">
          <VizContainer>
            <h4>Top songs in time range.</h4>
            <TopSongsChart username="sonofatailor" />
          </VizContainer>
        </div>
      </main>
    </div>
  );
};

export default Stats;
