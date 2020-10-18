import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import PageContainer from "../../components/PageContainer";
import StyledSelect from "../../components/StyledSelect";
import { MetadataOps } from "../../utils";

const buttonStyle =
  "bg-transparent cursor-pointer hover:bg-gray-800 text-black hover:text-white border border-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-lg";
const formStyle =
  "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2 max-w-md m-auto text-center";

const Update = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);
  const [quedUsers, setQuedUsers] = useState([]);
  const [addingUser, setAddingUser] = useState(false);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) router.push(`/update/${selectedUser}`);
  };

  useEffect(() => {
    fetch(`api/metadata?op=${MetadataOps.allusernames}`).then((res) =>
      res.json().then((data) => setExistingUsers(data.data.usernames))
    );
  }, []);

  useEffect(() => {
    const getQuedUsers = async () => {
      fetch(`api/metadata?op=${MetadataOps.usersinqueue}`).then((r) => {
        r.json().then((data) => {
          console.log(data.data);
          setQuedUsers(data.data.quedusers);
        });
      });
    };
    getQuedUsers();
  }, [addingUser]);

  const addUserToQueue = async (nu) => {
    setAddingUser(true);
    await fetch(`api/metadata?op=${MetadataOps.addusertoqueue}`, {
      body: nu,
      method: "POST",
    });
    setAddingUser(false);
  };

  const handleAddNewUser = async (e) => {
    console.log("handling click");
    e.persist();
    e.preventDefault();
    await addUserToQueue(e.target.newUser.value);
    e.target.newUser.value = "";
  };

  return (
    <PageContainer page="UPDATE">
      <Head>
        <title> LastFm Redux: Ingest.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <form className={formStyle} onSubmit={handleSubmit}>
            <h1 className="text-2xl text-center">
              Update Scrobbles From LastFM
            </h1>
            <div className="text-center mt-3 border-t pt-3">
              <label htmlFor="selectusername">Select a user to continue:</label>
              <StyledSelect
                name="selectusername"
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={existingUsers.length === 0}
              >
                <option>
                  {existingUsers.length > 0
                    ? "Select username"
                    : "Loading users..."}
                </option>
                {existingUsers.map((u) => (
                  <option value={u} key={u}>
                    {u}
                  </option>
                ))}
              </StyledSelect>
            </div>
            <input type="submit" className={buttonStyle} />
          </form>
        </div>
        <div className="my-10">
          <form className={formStyle} onSubmit={handleAddNewUser}>
            <h3 className="py-1 text-xl">Add new user to queue</h3>
            <input
              className="border border-gray-400 appearance-none rounded w-auto px-3 py-2 my-2 focus focus:border-gray-700 focus:outline-none block m-auto"
              placeholder="Enter lastfm user"
              type="text"
              name="newUser"
            />
            <button
              className={`${buttonStyle} my-3`}
              role="submit"
              disabled={addingUser}
            >
              {addingUser ? "Adding..." : "Add"}
            </button>
            <p className="text-xs">
              Valid lastfm usernames will be manually ingested.
            </p>
          </form>
        </div>
        <div className={formStyle}>
          <p className="text-lg">Queued users</p>
          <ul className="list-reset flex flex-col">
            {quedUsers.map((qu) => (
              <li
                className="relative -mb-px block border-l-4 m-2 border-blue-400 hover hover:border-blue-700 hover:bg-red-300"
                key={qu}
              >
                {qu}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </PageContainer>
  );
};

export default Update;
