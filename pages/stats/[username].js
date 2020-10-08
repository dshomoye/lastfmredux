import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense } from "react";

import Calendar from "../../components/Calendar";
import ErrorBoundary from "../../components/ErrorBoundary";
import GenreSunBurst from "../../components/GenreSunBurst";
import Loading from "../../components/Loading";
import PageContainer from "../../components/PageContainer";
import TopSongsChart from "../../components/TopSongsChart";
import Bubble from '../../components/Bubble'

const VizContainer = ({ children, title }) => (
  <div
    className="flex-initial w-full lg:w-1/2 my-8 py-2 overflow-visible text-center shadow-inner border-solid border-t-2 border-gray-600"
    style={{ height: "26rem" }}
  >
    <h3 className="text-xl">{title}</h3>
    <ErrorBoundary fallback={<p>Error Loading.</p>}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  </div>
);

const UserStats = () => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <PageContainer page="VIEW">
      <Head>
        <title> LastFm Redux: Listening Patterns</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!!username ? (
          <>
            <h1 className="text-2xl text-center">
              Scrobble Patterns for {username}
            </h1>
            <div className="flex flex-wrap mb-16">
              <VizContainer title="Trends: Top 10">
                <TopSongsChart username={username} />
              </VizContainer>
              <VizContainer title="Artists Stats">
                <Bubble username={username} />
              </VizContainer>
              <VizContainer title="Listening Calendar">
                <Calendar username={username} />
              </VizContainer>
              <VizContainer title="Genre Stats">
                <GenreSunBurst username={username} />
              </VizContainer>
            </div>
          </>
        ) : <Loading />}
      </main>
    </PageContainer>
  );
};

export default UserStats;
