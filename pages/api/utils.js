export const LFApiURl = "http://ws.audioscrobbler.com/2.0/";
import { getUserLastScrobble } from './services/db'

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

export const saveScrobblesForPage = async (username, page, from) => {
  const requestUrl = `${LFApiURl}?method=user.getRecentTracks&api_key=${process.env.LASTFM_KEY}&format=json&user=${username}&limit=1000&page=${page}&from=${from}`;
  let response = await fetch(requestUrl)
  let scrobbleData = await response.json()
  const tracks = scrobbleData.recenttracks.track;
  const scrobbles = tracks.map(getScrobble).filter((s) => !!s);
  //save scrobbles to db
  return
}

export const getTotalPages = async username => {
  try {
    const latest = await getUserLastScrobble(username)
    const latestUtc = parseInt((latest.getTime())/1000)
    const requestUrl = `${LFApiURl}?method=user.getRecentTracks&api_key=${process.env.LASTFM_KEY}&format=json&user=${username}&limit=1000&from=${latestUtc}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    const { totalPages } = data.recenttracks["@attr"];
    return {
      totalPages,
      from: latestUtc
    }
  } catch (error) {
    console.error(error)
    return null;
  }
}