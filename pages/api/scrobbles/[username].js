import Cors from "cors";
import { MongoClient, ObjectID } from "mongodb";
import { getDb, batchGetSongId } from "../services/db"

const cors = Cors({
  methods: ["GET", "POST"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handler = async (req, res) => {
  try {
    await runMiddleware(req, res, cors);
    const db = await getDb();
    const sampleSong = {
      title: "Call",
      artist: "Joeboy",
      album: "Call"
    }
    const foundSongs = await batchGetSongId([{title: "Begining", album: "Begining", artist: "Joeboy"}, { title: "Baby", album: "Baby", artist: "Joeboy"}, sampleSong])
    console.log('found songs ', foundSongs)
    const {
      query: { username },
    } = req;
    res.send(`Post: ${username}`);
  } catch (error) {
    console.log(error);
    res.send("Error Occured");
  }
};

export default handler;
