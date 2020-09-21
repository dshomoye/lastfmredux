import Cors from "cors";
import {runMiddleware} from '../../utils'
import { topWeeklySongs } from '../../services/db'

const cors = Cors({methods: ["GET", "POST"],});

export default async (req, res) => {
  const requestStart = new Date()
  try {
    await runMiddleware(req, res, cors)
    const { query, body } = req;
    console.log(query)
    let resData
    switch (query.op) {
      case 'topweeklysongs':
        const queryResult = await topWeeklySongs('sonofatailor')
        res.status(200)
        res.json({ data: queryResult })
        break;
        default:
          resData = { message: 'Not Supported'}
          res.status(400);
          res.send(resData)
        }
    } catch(error) {
      console.error(error)
      res.status(500)
      res.send('Server Error')
    }
  const runTime = (new Date().getTime() - requestStart.getTime())
  console.log(`${req.method}: Run Time: ${runTime}ms`)
}
