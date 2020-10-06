import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { getUntaggedArtistIds, updateArtistsMetadata } from "../../utils";

const btnClass =
  "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded";

const UpdateArtists = () => {
  const [artistIds, setArtistIds] = useState([]);
  const [startUpdate, setStartUpdate] = useState(false);
  const [updatedArtists, setUpdatedArtists] = useState([]);
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState('Waiting...')

  const makeUpdates = (ids) => {
    console.log(ids);
    updateArtistsMetadata(artistIds).subscribe({
      next: (item) => {
        console.log("update result: ", item);
        setUpdatedArtists(old => { 
          const n = [old, ...item]
          setStatus(`${n.length} artists updated`)
          return n
        })
      },
      complete: () => {
        setArtistIds([]);
        setUpdatedArtists([]);
        setProcessing(false)
        setStatus('Done.')
        console.log("update done");
      },
      error: (err) => console.error("Update failed ", err),
    });
  };

  useEffect(() => {
    if (startUpdate) {
      makeUpdates(artistIds);
      setStartUpdate(false);
    }
  }, [startUpdate, artistIds]);

  const handleUpdateArtist = async () => {
    setProcessing(true)
    setStatus('Starting')
    getUntaggedArtistIds().subscribe({
      next: (item) => {
        console.log("item returned ", item, " at ", new Date().getTime());
        setArtistIds((old) => {
          const n = item.id ? [...old, item.id] : old
          setStatus(`${n.length} ids fetched.`)
          return n
        });
      },
      complete: () => {
        setStatus('Ids fetched, updating...')
        setStartUpdate(true);
      },
      error: () => {
        console.log("failed");
      },
    });
  };

  return (
    <div>
      <p>{status}</p>
      <button className={btnClass} onClick={handleUpdateArtist} disabled={processing}>
        Update Artists
      </button>
    </div>
  );
};

export default function Metadata() {
  return (
    <div className="container max-w-md p-10 text-center justify-items-center">
      <Head>
        <title>Update Metadata</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-wrap">
          <div className="w-1/2 p-5">
            <UpdateArtists />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
