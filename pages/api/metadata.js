import { MetadataOps } from "../../utils"
import { getUntaggedArtists, saveArtists, setArtistUpdateTimestamp } from "./services/db"
import {getArtistId, getArtistsMetadata} from './services/spotify'

export default async (req, res) => {
  const requestStart = new Date()
  try {
    const { query, body} = req
    if (query.op === MetadataOps.untaggedartists) {
      const result = await getUntaggedArtists()
      res.json({data: result.slice(0,20)})
    } else if (query.op === MetadataOps.getartistspotifyid) {
      const id = await getArtistId(body)
      res.json({data: {id}})
    } else if (query.op === MetadataOps.updateartists) {
      const result = await getArtistsMetadata(body.artistIds)
      await saveArtists(result)
      res.json({data: result})
    } else if (query.op === MetadataOps.setartisttimestamp) {
      await setArtistUpdateTimestamp()
      res.json({data: {result: 'done'}})
    }
  } catch (error) {
    console.error(error)
    res.status(500)
    res.end("Error Occured")
  }
  const runTime = (new Date().getTime() - requestStart.getTime())
  console.log(`${req.method}: Run Time: ${runTime}ms`)
}