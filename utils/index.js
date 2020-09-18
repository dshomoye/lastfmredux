import { mergeAll } from "rxjs/operators";
import { from } from "rxjs";

const LFApiURl = "http://ws.audioscrobbler.com/2.0/";
const apiKey = "df744524f168ddca71c7d8c6e65e8e62";

export const getTotalPages = async (username) => {
  try {
    const requestUrl = `${LFApiURl}?method=user.getRecentTracks&api_key=${apiKey}&format=json&user=${username}&limit=1000`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    const { totalPages } = data.recenttracks["@attr"];
    return totalPages;
  } catch (error) {
    return null;
  }
};

const getScrobble = (rawScrobble) => {
  try {
    const scrobbleTime = rawScrobble.date.uts
      ? new Date(parseInt(rawScrobble.date.uts) * 1000)
      : new Date();
    return {
      song: {
        title: rawScrobble.name,
        artist: rawScrobble.artist["#text"],
        album: rawScrobble.album["#text"],
      },
      time: new Date(scrobbleTime),
    };
  } catch {
    return null;
  }
};

const sendScrobbles = async (username, scrobbles) => {
  const body = {
    scrobbles,
  };
  try {
    const response = await fetch(`/api/scrobbles/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return true;
  } catch {
    return false;
  }
};

export function saveScrobbles(username, totalPages) {
  console.log("saving totalpages for ", username, totalPages);
  let currentPage = totalPages;
  const promises = [];
  while (currentPage > 0) {
    const requestUrl = `${LFApiURl}?method=user.getRecentTracks&api_key=${apiKey}&format=json&user=${username}&limit=1000&page=${currentPage}`;
    const p = new Promise((resolve, reject) => {
      fetch(requestUrl)
      .then(response => {
        response.json()
        .then(data => {
          const tracks = data.recenttracks.track;
          const scrobbles = tracks.map(getScrobble).filter((s) => !!s);
          sendScrobbles(username, scrobbles)
          .then(result => resolve(result))
        })
      })
      .catch(error => reject(error))
    })
    promises.push(p);
    currentPage -= 1;
  }
  return from(promises).pipe(mergeAll())
}
