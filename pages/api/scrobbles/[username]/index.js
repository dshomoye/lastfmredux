import Cors from "cors";
import { getTotalPages, saveScrobblesForPage, runMiddleware } from "../../../../utils/apiUtils";

const cors = Cors({methods: ["GET", "POST"],});

const handler = async (req, res) => {
  try {
    const requestStart = new Date()
    await runMiddleware(req, res, cors);
    const { query: { username }, body } = req;
    let resData = { message: "Not Supported"}
    res.status(400)
    if (req.method === 'GET') {
      resData = await getTotalPages(username)
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
    console.log(`Run Time: ${runTime}s`)
    res.send(resData);
  } catch (error) {
    console.log(error);
    res.status(500)
    res.send("Error Occured");
  } finally {
    // console.log('DONE')
  }
};

export default handler;
