import Cors from "cors";
import { saveScrobble, getUser } from "../services/db"

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
    const sampleSong = {
      title: "Call",
      artist: "Joeboy",
      album: "Call"
    }
    const {
      query: { username },
      body
    } = req;
    console.log('request body')
    console.log(body)
    res.send(`Post: ${username}`);
  } catch (error) {
    console.log(error);
    res.send("Error Occured");
  }
};

export default handler;
