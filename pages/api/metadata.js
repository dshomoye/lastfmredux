import { MetadataOps } from "../../utils"
import { getUntaggedArtists, saveArtists } from "./services/db"
import {getArtistId, getArtistsMetadata} from './services/spotify'

export default async (req, res) => {
  try {
    const requestStart = new Date()
    const { query, body} = req
    if (query.op === MetadataOps.untaggedartists) {
      // get list of artists not in metadata collection in db
      const result = await getUntaggedArtists()
      res.json({data: result})
    } else if (query.op === MetadataOps.getartistspotifyid) {
      console.log(query, body)
      const id = await getArtistId(body)
      res.json({id})
    } else if (query.op === MetadataOps.updateartists) {
      const artists = ["5yOvAmpIR7hVxiS6Ls5DPO"]
      const result = await getArtistsMetadata(artists)
      await saveArtists(result)
      res.json({data: result})
    }
  } catch (error) {
    console.error(error)
    res.status(500)
    res.end("Error Occured")
  }
}