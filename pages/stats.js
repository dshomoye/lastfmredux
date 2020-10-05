import Head from "next/head";
import Bubble from "../components/Bubble";
import Calendar from "../components/Calendar";
import GenreStarBurst from "../components/GenreStarBurst";
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
        <h1 className="text-2xl text-center">Listening Statistics</h1>
        <div className="flex flex-wrap">
          <VizContainer>
            <h3>Top 10 songs</h3>
            <TopSongsChart username="sonofatailor" />
          </VizContainer>
          <VizContainer>
            <h3>Artist Tree View</h3>
            <Bubble username="sonofatailor" />
          </VizContainer>
          <VizContainer>
            <h3>Calendar</h3>
            <Calendar username="sonofatailor" />
          </VizContainer>
          <VizContainer>
            <h3>Genre Tree</h3>
            <GenreStarBurst username="sonofatailor" />
          </VizContainer>
        </div>
      </main>
    </div>
  );
};

export default Stats;
