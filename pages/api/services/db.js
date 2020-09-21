import { MongoClient } from "mongodb";
import { startOfWeek, subWeeks } from "date-fns";

import "../typedef";

const dburi = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@lastfmredux.lwjai.gcp.mongodb.net/lastfmredux?retryWrites=true&w=majority`;
const dbclient = new MongoClient(dburi, { useUnifiedTopology: true });

const getDb = async () => {
  if (dbclient.isConnected()) {
    return dbclient.db();
  } else {
    await dbclient.connect();
    return dbclient.db();
  }
};

const getScrobblesCollection = async () => {
  const db = await getDb();
  return db.collection("scrobbles");
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
const threeWeeksAgo = subWeeks(startOfWeek(today), 3);
export const topWeeklySongs = async (
  username,
  from = threeWeeksAgo,
  to = today
) => {
  const scrobblesCollection = await getScrobblesCollection();
  const pipeline = [
    {
      $match: {
        username,
        time: {
          $gt: from,
          $lt: to,
        },
      },
    },
    {
      $project: {
        week: {
          $week: "$time",
        },
        'year': {
          '$year': '$time'
        }, 
        song: "$song.title",
        artist: "$song.artist",
        album: "$song.album",
      },
    },
    {
      $group: {
        _id: {
          week: "$week",
          year: '$year',
          song: "$song",
          album: "$album",
          artist: "$artist",
        },
        listens: {
          $sum: 1,
        },
      },
    }
  ]
  const cursor = scrobblesCollection.aggregate(pipeline);
  const result = [];
  await cursor.forEach((entry) => {
    result.push(entry);
  });
  return result;
};
