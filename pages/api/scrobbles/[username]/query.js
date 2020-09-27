import Cors from "cors";

import {runMiddleware, getGenreTreeFromSongs} from '../../utils'
import { topSongsInTime } from '../../services/db'

const cors = Cors({methods: ["GET", "POST"],});

const timeRangeFromQuery = (query) => {
  let from;
  let to;
  if (query.from) {
    from = new Date(parseInt(query.from))
  }
  if (query.to) {
    to = new Date(parseInt(query.to))
  }
  return [from, to]
}

export default async (req, res) => {
  const requestStart = new Date()
  try {
    await runMiddleware(req, res, cors)
    const { query, body } = req;
    console.log(query)
    let resData
    let queryResult
    switch (query.op) {
      case 'topsongs':
        queryResult = await topSongsInTime(query.username, ...timeRangeFromQuery(query));
        res.json({data: queryResult})
        break
      case 'artisttree':
        const topSongs = await topSongsInTime(query.username, ...timeRangeFromQuery(query), 100);
        const root =await getGenreTreeFromSongs(topSongs)
        res.json({data: root})
        break
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
