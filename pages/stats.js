import Head from "next/head";
import Bubble from "../components/Bubble";
import TopSongsChart from "../components/TopSongsChart";

const VizContainer = ({ children }) => (
  <div className="flex-initial w-full lg:w-1/2 my-8 overflow-visible" style={{height: '22rem'}}>
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
          <VizContainer>
            <h4>Tree View</h4>
            <Bubble username="sonofatailor" />
          </VizContainer>
        </div>
      </main>
    </div>
  );
};

export default Stats;
