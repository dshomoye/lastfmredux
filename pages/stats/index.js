import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";

import PageContainer from "../../components/PageContainer";
import StyledSelect from "../../components/StyledSelect";
import { MetadataOps } from "../../utils";

const Stats = () => {
  const [selectedUser, setSelectedUser] = useState('')
  const [existingUsers, setExistingUsers] = useState([])
  const router = useRouter();

  const handleSubmit = e => {
    e.preventDefault()
    if (selectedUser) router.push(`/stats/${selectedUser}`)
  }

  useEffect(() => {
    fetch(`api/metadata?op=${MetadataOps.allusernames}`)
      .then(res => res.json()
        .then(data => setExistingUsers(data.data.usernames))
      )
  }, [])

  return (
    <PageContainer page="VIEW">
      <Head>
        <title> LastFm Redux: Listening Patterns</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md m-auto text-center"
        onSubmit={handleSubmit}
      >
      <h1 className="text-3xl text-center">View User Patterns</h1>
        <div className="text-center mt-3 border-t pt-3">
        <label htmlFor="selectusername">Select a user to view stats:</label>
        <StyledSelect name="selectusername" onChange={e => setSelectedUser(e.target.value)}>
          <option>Select a username</option>
          {existingUsers.map(u => (<option value={u} key={u}>{u}</option>))}
        </StyledSelect>
      </div>
        <input
          type="submit"
          className="bg-transparent cursor-pointer hover:bg-gray-800 text-black hover:text-white border border-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-lg"
        />
      </form>
    </div>
    </PageContainer>
  );
};

export default Stats;
