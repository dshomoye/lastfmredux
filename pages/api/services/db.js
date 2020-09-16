import Dataloader from 'dataloader'
import { MongoClient } from "mongodb";

/**
 * @typedef {Object} Song
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * 
 * @typedef Scrobble
 * @property {Song} song
 * @property {Date} time 
 */

const dburi = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@lastfmredux.lwjai.gcp.mongodb.net/lastfmredux?retryWrites=true&w=majority`;
const dbclient = new MongoClient(dburi, { useUnifiedTopology: true });

export const getDb = async () => {
  if (dbclient.isConnected()) {
    return dbclient.db()
  } else {
    await dbclient.connect();
    return dbclient.db();
  }
}

export const disconnect = async () => {
  console.log('disconnecting')
  if(dbclient.isConnected()) await dbclient.close()
}

export const getSongsCollection = async () => {
  const db = await getDb()
  return db.collection('songs')
}

const getScrobblesCollection = async () => {
  const db = await getDb;
  return db.collection('scrobbles')
}

/**
 * 
 * @param {Song[]} songs
 * @returns {Promise<Array<Song|null>>} array of matched songids or null
 */
async function batchGetSongId(songs) {
  const songsCollection = await getSongsCollection()
  const mongoQuery = {$or: songs.map(song => ({...song}))}
  const cursor = songsCollection.find(mongoQuery)
  let res = []
  await cursor.forEach(doc => {
    res.push(doc)
  })
  let songIds = [...songs]
  for (let index = 0; index < songs.length; index++) {
    const song = res[index]
    const found = res.find( s => {
      return (song && s.title === song.title && s.album === song.album && s.artist === song.artist)
    })
    if(found && found._id) {
      songIds[index] = found._id
    } else {
      songIds[index] = null
    }
  }
  return songIds
}

/**
 * 
 * @param {Song} song
 * @returns {string} songId
 */
const addSongToDb = async song => {
  const songsCollection = await getSongsCollection()
  const result = await songsCollection.insertOne(song);
  return result._id

}

const songIdLoader = new Dataloader(batchGetSongId)

/**
 * Gets the songid if song is in db.
 * will save a new song to db and return id
 * @param {Song} song 
 */
const getSongId = async song => {
  let songId = await songIdLoader.load(song)
  if (!songId) {
    songId = addSongToDb(song)
  }
  return songId
}


/**
 * @param {Scrobble} scrobble
 * @returns {string} the id of the added scrobble
 */
export const saveScrobble = async scrobble => {
  const scrobbleSong = await getSongId(scrobble.song)
  const scrobblesCollection = await getScrobblesCollection()
  const result = await scrobblesCollection.insertOne({
    time: scrobble.time,
    song: scrobbleSong
  })
  return result._id
}

