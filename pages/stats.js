import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense } from "react";

import Bubble from "../components/Bubble";
import Calendar from "../components/Calendar";
import Footer from "../components/Footer";
import GenreSunBurst from "../components/GenreSunBurst";
import TopSongsChart from "../components/TopSongsChart";
import Loading from "../components/Loading";
import ErrorBoundary from "../components/ErrorBoundary";
import PageContainer from "../components/PageContainer";

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

const Stats = () => {
  const router = useRouter();
  const { username } = router.query;

  const handleSetUsername = (e) => {
    e.preventDefault();
    router.push(`/stats?username=${e.target.username.value}`, undefined, {
      shallow: true,
    });
  };

  console.log("username ", username);

  let body = (
    <>
      <h1 className="text-2xl text-center">Enter Username</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md m-auto text-center"
        onSubmit={handleSetUsername}
      >
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          name="username"
        />
        <input
          type="submit"
          className="bg-transparent hover:bg-gray-800 text-black hover:text-white border border-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        />
      </form>
    </>
  );

  if (username) {
    body = (
      <main>
        <h1 className="text-2xl text-center">
          Scrobble Patterns for {username}
        </h1>
        <div className="flex flex-wrap mb-16">
          <VizContainer title="Top 10 Tracks">
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
      </main>
    );
  }
  return (
    <PageContainer page="VIEW">
      <Head>
        <title>View Patterns</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {body}
    </PageContainer>
  );
};

export default Stats;
