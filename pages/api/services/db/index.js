import { MongoClient } from "mongodb";
import { subDays } from "date-fns";

import "../../typedef";

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
const lastWeek = subDays(today, 7);
export const topSongsInTime = async (username, from=lastWeek, to=today, limit=10) => {
  const earliest = from || lastWeek;
  const latest = to || today

  const scrobblesCollection = await getScrobblesCollection();
  const pipeline = [
    {
      '$match': {
        'username': username,
        time: {
          $gte: earliest,
          $lte: latest,
        }
      }
    }, {
      '$group': {
        '_id': {
          'title': '$song.title', 
          'artist': '$song.artist'
        }, 
        'plays': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        'plays': -1
      }
    }, {
      '$limit': limit
    }
  ]
  const cursor = scrobblesCollection.aggregate(pipeline);
  const result = [];
  await cursor.forEach(s => result.push(s));
  return result.map(s => ({plays: s.plays, ...s._id}));
}