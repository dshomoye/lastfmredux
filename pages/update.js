import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { saveScrobbles } from "../utils";
import PageContainer from '../components/PageContainer'

const Update = () => {
  const [username, setUsername] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [completedPages, setCompletedPages] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setInProgress(true);
    const totalPagesRes = await fetch(`/api/scrobbles/${username}`);
    const { totalPages, from } = await totalPagesRes.json();
    if (totalPages === 0) {
      setInProgress(false);
      setIsUpdated(true);
      return;
    }
    setNumOfPages(parseInt(totalPages));
    const pages$ = saveScrobbles(username, totalPages, from);
    setDownloading(true);
    pages$.subscribe({
      next: () => {
        setCompletedPages((prev) => prev + 1);
      },
      complete: () => {
        setDownloading(false);
        setInProgress(false);
        setCompletedPages(0);
        setIsUpdated(true);
        setNumOfPages(0);
      },
    });
  };

  let body = (
    <>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md m-auto"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl my-2">Ingest Scrobbles</h1>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Enter LastFM username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => setUsername(e.target.value)}
          id="username"
          name="username"
          placeholder="Last FM username"
          type="text"
        />
        <input
          className="bg-transparent cursor-pointer hover:bg-gray-800 text-black hover:text-white border border-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md"
          type="submit"
          disabled={inProgress}
        />
      </form>
    </>
  );
  if (downloading) {
    body = (
      <div>
        <p>
          Downloading:{" "}
          {parseFloat(completedPages / numOfPages).toPrecision(1) * 100}%
          complete
        </p>
      </div>
    );
  } else if (isUpdated) {
    body = (
      <div>
        <p>Scrobbles for {username} updated.</p>
        <Link href={`/stats?username=${username}`}>
          <a className="py-5 text-md my-10 text-blue-700">View Stats and Viz 📊</a>
        </Link>
      </div>
    );
  }

  return (
    <PageContainer page="UPDATE">
      <Head>
        <title>LastFM Redux: Update Scrobbles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center">{body}</main>
    </PageContainer>
  );
};

export default Update;
