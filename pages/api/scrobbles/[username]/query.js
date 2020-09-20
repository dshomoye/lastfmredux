import Cors from "cors";
import {runMiddleware} from '../../utils'
import { topWeeklySongs } from '../../services/db'

const cors = Cors({methods: ["GET", "POST"],});

export default async (req, res) => {
  const requestStart = new Date()
  await runMiddleware(req, res, cors)
  await topWeeklySongs('sonofatailor')
  const runTime = (new Date().getTime() - requestStart.getTime())
  console.log(`${req.method}: Run Time: ${runTime}ms`)
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
