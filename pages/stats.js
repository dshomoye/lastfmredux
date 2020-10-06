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

const VizContainer = ({ children, title }) => (
  <div
    className="flex-initial w-full lg:w-1/2 my-8 overflow-visible"
    style={{ height: "22rem" }}
  >
    <h3>{title}</h3>
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

  if (!username) {
    return (
      <div className="container">
        <h1>Enter Username</h1>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSetUsername}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              name="username"
            />
          </div>
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          />
        </form>
        <Footer />
      </div>
    );
  }

  if (username)
    return (
      <div>
        <Head>
          <title>View Stats</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="container">
          <h1 className="text-2xl text-center">
            Listening Statistics for {username}
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
          <Footer />
        </main>
      </div>
    );
};

export default Stats;
