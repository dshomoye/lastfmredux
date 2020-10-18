import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { saveScrobbles } from "../../utils";
import PageContainer from "../../components/PageContainer";
import { useRouter } from "next/router";

const Update = () => {
  const [completedPages, setCompletedPages] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);

  const {
    query: { username },
  } = useRouter();

  useEffect(() => {
    const updateScroblles = async () => {
      const totalPagesRes = await fetch(`/api/scrobbles/${username}`);
      const { totalPages, from } = await totalPagesRes.json();
      if (totalPages === 0) {
        setIsUpdated(true);
        return;
      }
      setNumOfPages(parseInt(totalPages));
      const pages$ = saveScrobbles(username, totalPages, from);
      pages$.subscribe({
        next: () => {
          setCompletedPages((prev) => prev + 1);
        },
        complete: () => {
          setCompletedPages(0);
          setIsUpdated(true);
          setNumOfPages(0);
        },
      });
    }
    updateScroblles()
  }, [])

  let percentComplete = 0
  if (numOfPages) {
    percentComplete = parseFloat(completedPages / numOfPages).toPrecision(1) * 100
  }

  let body = (
    <div>
      <p>
        Downloading:{" "}
        {percentComplete}% complete
      </p>
    </div>
  );
  if (isUpdated) {
    body = (
      <div>
        <p>Scrobbles for {username} updated.</p>
        <Link href={`/stats/${username}`}>
          <a className="py-5 text-md my-10 text-blue-700">
            View Stats and Viz 📊
          </a>
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
