import { groupBy } from "lodash";

export const LFApiURl = "http://ws.audioscrobbler.com/2.0/";
import { getUserLastScrobble, saveScrobbles } from "../services/db";
import "./typedef";

/**
 *
 * @param {Object} rawScrobble
 * @returns {Scrobble} parsed scrobble
 */
const getScrobble = (rawScrobble, username) => {
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
      username,
    };
  } catch {
    return null;
  }
};

export const saveScrobblesForPage = async (username, page, from) => {
  const requestUrl = `${LFApiURl}?method=user.getRecentTracks&api_key=${
    process.env.LASTFM_KEY
  }&format=json&user=${username}&limit=1000&page=${page}&from=${from + 1}`;
  let response = await fetch(requestUrl);
  let scrobbleData = await response.json();
  const tracks = scrobbleData.recenttracks.track;
  const scrobbles = tracks
    .map((s) => getScrobble(s, username))
    .filter((s) => !!s);
  if (scrobbles && scrobbles.length > 0) await saveScrobbles(scrobbles);
};

export const getTotalPages = async (username) => {
  try {
    const latest = await getUserLastScrobble(username);
    const latestUtc = parseInt(latest.getTime() / 1000);
    const requestUrl = `${LFApiURl}?method=user.getRecentTracks&api_key=${process.env.LASTFM_KEY}&format=json&user=${username}&limit=1000&from=${latestUtc}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    const { totalPages } = data.recenttracks["@attr"];
    return {
      totalPages,
      from: latestUtc,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

/**
 * @param {SongPlays[]} songPlays
 * @returns {Promise<Object<string, ArtistStats>>}
 */
export const getArtistTreeFromSongs = async (songPlays) => {
  const artistsNode = groupBy(songPlays, (s) => s.artist);
  Object.keys(artistsNode).map((artistName) => {
    const artistAlbums = groupBy(artistsNode[artistName], (s) => s.album);
    const artistNode = {
      albums: artistAlbums,
    };
    Object.keys(artistAlbums).forEach((album) => {
      const albumSongs = artistAlbums[album];
      const albumNode = {
        songs: albumSongs,
      };
      artistAlbums[album] = albumNode;
    });
    artistsNode[artistName] = artistNode;
  });
  const root = {
    children: [],
    name: "All Artists",
  };
  Object.keys(artistsNode).forEach((artist) => {
    const artnode = artistsNode[artist];
    const artistRoot = {
      name: artist,
      children: [],
      type: "artist",
    };
    Object.keys(artnode.albums).forEach((album) => {
      const albnode = artnode.albums[album];
      albnode.songs.map((song, index) => {
        albnode.songs[index] = { ...song, name: song.title };
      });
      const albRoot = {
        name: album,
        children: albnode.songs,
        type: "album",
      };
      artistRoot.children.push(albRoot);
    });
    root.children.push(artistRoot);
  });
  return root;
};

export const getGenreTree = async (artistGenres, songPlays) => {
  const genreArtists = {};
  artistGenres.forEach((a) => {
    a.genres?.forEach((g) => {
      if (!(g in genreArtists)) {
        genreArtists[g] = new Set();
      }
      genreArtists[g].add(a.artist);
    });
  });
  const artistPlays = groupBy(
    songPlays.map((s) => ({ ...s, name: s.title })),
    "artist"
  );
  const artistTree = {};
  Object.keys(artistPlays).forEach((a) => {
    artistTree[a] = { name: a, children: artistPlays[a] };
  });
  const genreTree = {};
  Object.keys(genreArtists).forEach((g) => {
    genreTree[g] = {
      name: g,
      children: [],
    };
    genreArtists[g].forEach((a) => {
      genreTree[g].children.push(artistTree[a]);
    });
  });
  const root = {
    name: "All Genres",
    children: Object.keys(genreTree).map((g) => genreTree[g]),
  };
  return root;
};
