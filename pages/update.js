import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import updateStyle from "../styles/update.module.css";
import { saveScrobbles } from "../utils";
import classsnames from "classnames";

const Update = () => {
  const [username, setUsername] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [completedPages, setCompletedPages] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setInProgress(true);
    const totalPagesRes = await fetch(`/api/scrobbles/${username}`)
    const {totalPages, from } = await totalPagesRes.json()
    setNumOfPages(parseInt(totalPages))
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
        setNumOfPages(0);
      }
    })
  };

  const handleUserChange = (e) => setUsername(e.target.value);

  const submitClass = classsnames({
    [updateStyle.submit]: true,
    [updateStyle.disabledSubmit]: inProgress,
  });
  return (
    <div>
      <Head>
        <title>Update Scrobbles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {downloading ? (
          <div>
            <p>
              Downloading: {parseFloat(completedPages/numOfPages).toPrecision(1)*100}%
              complete
            </p>
          </div>
        ) : (
          <>
            <h1 className={styles.updateTitle}>
              Enter lastfm account name and click submit
            </h1>
            <div>
              <form onSubmit={handleSubmit}>
                <input
                  className={updateStyle.text}
                  onChange={handleUserChange}
                />
                <input
                  type="submit"
                  className={submitClass}
                  disabled={inProgress}
                />
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Update;
