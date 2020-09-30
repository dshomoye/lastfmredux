import Head from "next/head";

export default function Metadata() {
  return (
    <div>
      <Head>
        <title>Update Metadata</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div className="flex flex-wrap">
          <div className="w-1/2 p-5">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              Update Artists
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
