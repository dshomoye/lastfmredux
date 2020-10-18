import { MetadataOps } from "../../utils"
import * as db from "../../services/db"
import * as spotify from '../../services/spotify'

export default async (req, res) => {
  const requestStart = new Date()
  try {
    const { query, body} = req
    if (query.op === MetadataOps.untaggedartists) {
      const result = await db.getUntaggedArtists()
      res.json({data: result.slice(0,20)})
    } else if (query.op === MetadataOps.getartistspotifyid) {
      const id = await spotify.getArtistId(body)
      res.json({data: {id}})
    } else if (query.op === MetadataOps.updateartists) {
      const result = await spotify.getArtistsMetadata(body.artistIds)
      await db.saveArtists(result)
      res.json({data: result})
    } else if (query.op === MetadataOps.setartisttimestamp) {
      await db.setArtistUpdateTimestamp()
      res.json({data: {result: 'done'}})
    } else if (query.op === MetadataOps.allusernames) {
      const usernames = await db.getAllUsers()
      res.json({data: {usernames}})
    } else if (query.op === MetadataOps.usersinqueue) {
      const quedusers = await db.getUsersInQueue()
      res.json({data: {quedusers}})
    } else if (query.op === MetadataOps.addusertoqueue) {
      try {
        await db.addUserToQueue(body)
      } catch (error) {
        console.error('Error adding user ', error)
      }
      res.json({result: "DONE"})
    }
  } catch (error) {
    console.error(error)
    res.status(500)
    res.end("Error Occured")
  }
  const runTime = (new Date().getTime() - requestStart.getTime())
  console.log(`Run Time: ${runTime}ms`)
}