import { MusicBrainzApi } from 'musicbrainz-api'

const mbApi = new MusicBrainzApi({
  appName: 'lfmredux',
  appVersion: '0.1.0',
});

/**
 * 
 * @param  {...string} args 
 */
export const getArtistTags = async (...args) => {
  const allTags = new Set()
  const allArtists = Array.isArray(args[0]) ? args[0] : args
  console.log('args ', allArtists)
  const artistsTags = await Promise.all(allArtists.map(async artist => {
    try {
      const artists = await mbApi.searchArtist(artist)
      if (artists.count > 0) {
        const a = artists.artists[0]
        if (a.tags && a.tags.length > 0) {
          const tagSet = new Set(a.tags.map(t => t.name))
          tagSet.forEach(t => allTags.add(t))
          return {
            [artist]: tagSet
          }
        }
        return null
      } 
    }catch(error) {
      console.error(error)
      return null
    }
  }))
  let tags = {}
  artistsTags.forEach(t => tags={...tags, ...t})
  console.log('tags ', tags)
  const commonTags = {}
  allTags.forEach(tag => {
    commonTags[tag] = []
    Object.keys(tags).forEach(k => {
      if (tags[k].has(tag)) {
        commonTags[tag].push(k)
      }
    })
  })
  console.log(commonTags)
  return commonTags
}
