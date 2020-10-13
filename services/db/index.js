import { MongoClient } from "mongodb";
import { subDays, startOfYear } from "date-fns";
import { differenceBy, sortBy } from "lodash";

import "../../utils/typedef";
import {
  allScrobbleArtistsPipeline,
  allUsernames,
  dailyPlaysCountPipeline,
  topArtistsPipeline,
  topGenresPipeline,
  topSongsPipeline,
} from "./pipelines";

const dburi = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@lastfmredux.lwjai.gcp.mongodb.net/lastfmredux?retryWrites=true&w=majority`;
const dbclient = new MongoClient(dburi, {
  useUnifiedTopology: true,
  loggerLevel: 'warn',
  poolSize: 1,
  keepAlive: false,
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});

const getDb = async () => {
  if (dbclient.isConnected()) {
    return dbclient.db();
  } else {
    await dbclient.connect();
    return dbclient.db();
  }
};

export const closeDb = async () => {
  await dbclient.close()
  await dbclient.logout()
}

const getScrobblesCollection = async () => {
  const db = await getDb();
  return db.collection("scrobbles");
};

const getArtistsCollection = async () => {
  const db = await getDb();
  return db.collection("artists");
};

const getTimestampCollection = async () => {
  const db = await getDb();
  return db.collection("timestamps_");
};

/**
 * @param {Array<Scrobble>} scrobbles
 * @returns {Promise<string>} the id of the added scrobble
 */
export const saveScrobbles = async (scrobbles) => {
  const scrobblesCollection = await getScrobblesCollection();
  const result = await scrobblesCollection.insertMany(scrobbles);
  return result.insertedIds;
};

/**
 * get last updated scrobble for user
 * @param {string} username
 * @returns {Promise<Date>}
 */
export const getUserLastScrobble = async (username) => {
  const scrobblesCollection = await getScrobblesCollection();
  const queryRes = scrobblesCollection
    .find({ username })
    .sort({ time: -1 })
    .limit(1);
  const latest = await queryRes.next();
  if (latest && latest.time) return latest.time;
  else return new Date(0);
};

export const createIndex = async () => {
  const scrobblesCollection = await getScrobblesCollection();
  await scrobblesCollection.createIndex({
    time: -1,
  });
};

const today = new Date();
const lastWeek = subDays(today, 7);
/**
 *
 * @param {string} username
 * @param {Date} from
 * @param {Date} to
 * @param {Number} limit
 * @returns {Promise<SongPlays[]>} song plays array
 */
export const topSongsInTime = async (
  username,
  from = lastWeek,
  to = today,
  limit = 10
) => {
  const earliest = from || lastWeek;
  const latest = to || today;
  limit = limit ? parseInt(limit) : 10;

  const scrobblesCollection = await getScrobblesCollection();
  const pipeline = topSongsPipeline(username, earliest, latest, limit);
  const cursor = scrobblesCollection.aggregate(pipeline);
  const result = [];
  await cursor.forEach((s) => result.push(s));
  return result.map((s) => ({ plays: s.plays, ...s._id }));
};

const yearStart = startOfYear(today);
/**
 *
 * @param {string} username
 * @param {Date} from
 * @param {Date} to
 * @returns {Promise<DailyCount[]>}
 */
export const dailyPlayCount = async (
  username,
  from = yearStart,
  to = today
) => {
  const earliest = from || yearStart;
  const latest = to || today;
  const scrobblesCollection = await getScrobblesCollection();
  const pipeline = dailyPlaysCountPipeline(username, earliest, latest);
  const cursor = scrobblesCollection.aggregate(pipeline);
  const result = [];
  await cursor.forEach((s) => result.push(s));
  return result.map((r) => ({ value: r.count, day: r._id.date }));
};

export const getUntaggedArtists = async () => {
  const scrobblesCollection = await getScrobblesCollection();
  const artistsCollection = await getArtistsCollection();

  const tCollection = await getTimestampCollection();
  const latestCursor = await tCollection.findOne({ collection: "artists" });
  const allArtistsCursor = scrobblesCollection.aggregate(
    allScrobbleArtistsPipeline(latestCursor.time)
  );
  const taggedArtistsCursor = artistsCollection
    .find()
    .project({ artist: 1, _id: 0 });
  let allArtists = [];
  let taggedArtists = [];
  const queriesPromises = [
    allArtistsCursor.forEach((a) =>
      allArtists.push({ artist: a._id.artist, song: a.song })
    ),
    taggedArtistsCursor.forEach((a) => taggedArtists.push(a)),
  ];
  await Promise.all(queriesPromises);
  allArtists = sortBy(allArtists, ["artist"]);
  taggedArtists = sortBy(taggedArtists, ["artist"]);

  let untaggedArtists = differenceBy(allArtists, taggedArtists, "artist");
  return untaggedArtists;
};

export const saveArtists = async (artistsData) => {
  try {
    const artistsCollection = await getArtistsCollection();
    const promises = [];
    artistsData.forEach((item) =>
      promises.push(artistsCollection.insertOne(item))
    );
    await Promise.allSettled(promises);
    return [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const setArtistUpdateTimestamp = async () => {
  try {
    const tCollection = await getTimestampCollection();
    tCollection.updateOne(
      { collection: "artists" },
      {
        $set: {
          time: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error setting timestamp", error);
  }
};

/**
 *
 * @param {SongPlays[]} songs
 */
export const getGenresForSongs = async (songs) => {
  const artistsCollection = await getArtistsCollection();
  const artistArray = songs.map((s) => s.artist);
  const cursor = artistsCollection.find({ artist: { $in: artistArray } });
  const result = [];
  await cursor.forEach((r) => result.push(r));
  return result;
};

/**
 * @returns {Promise<String[]>} array of usernames
 */
export const getAllUsers = async () => {
  const scrobblesCollection = await getScrobblesCollection();
  const cursor = scrobblesCollection.aggregate(allUsernames);
  let usernames = []
  console.log('Retrieving usernames from results')
  await cursor.forEach(u => usernames.push(u._id));
  return usernames
}

export const topArtistsInTime = async (
  username,
  from = lastWeek,
  to = today,
  limit = 10
) => {
  const scrobblesCollection = await getScrobblesCollection();
  const earliest = from || lastWeek;
  const latest = to || today;
  limit = limit ? parseInt(limit) : 10;
  const pipeline = topArtistsPipeline(username, earliest, latest, limit);
  const cursor = scrobblesCollection.aggregate(pipeline);
  const result = []
  await cursor.forEach((s) => result.push({artist: s._id.artist, plays: s.plays}));
  return result
}

export const topGenresInTime = async (
  username,
  from = lastWeek,
  to = today,
  limit = 10
) => {
  const scrobblesCollection = await getScrobblesCollection();
  const earliest = from || lastWeek;
  const latest = to || today;
  limit = limit ? parseInt(limit) : 10;
  const pipeline = topGenresPipeline(username, earliest, latest, limit);
  const cursor = scrobblesCollection.aggregate(pipeline);
  const result = []
  await cursor.forEach(g => result.push({ genre: g._id, plays: g.plays}))
  return result
}