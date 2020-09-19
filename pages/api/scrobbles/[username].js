import Cors from "cors";
import { getTotalPages, saveScrobblesForPage } from "../utils";
import { createIndex } from '../services/db'

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
    const requestStart = new Date()
    await runMiddleware(req, res, cors);
    const { query: { username }, body } = req;
    let resData = { message: "Not Supported"}
    res.status(400)
    if (req.method === 'GET') {
      resData = await getTotalPages(username)
      await createIndex()
      res.status(200)
    } else if (req.method === 'POST') {
      if (body && body.page && (body.from || body.from === 0)) {
        await saveScrobblesForPage(username, parseInt(body.page), parseInt(body.from))
        res.status(201)
        resData = {
          result: 'completed'
        }
      }
    }
    const runTime = (new Date().getTime() - requestStart.getTime())/1000
    console.log(`${req.method}: Run Time: ${runTime}s`)
    res.send(resData);
  } catch (error) {
    console.log(error);
    res.status(500)
    res.send("Error Occured");
  }
};

export default handler;
