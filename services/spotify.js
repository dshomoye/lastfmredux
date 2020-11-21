import SpotifyAPI from "spotify-web-api-node";

const spotify = new SpotifyAPI({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SEC,
});

const authenticate = async () => {
  return new Promise((res) => {
    spotify.clientCredentialsGrant().then(
      (data) => {
        spotify.setAccessToken(data.body["access_token"]);
        res(true)
      },
      (err) => {
        console.error('auth failed')
        console.error(err);
        res(false)
      }
    );
  });
};

export const getArtistId = async (artistData) => {
  const auth = await authenticate()
  return new Promise((res, rej) => {
    if(!auth) {
      rej('Failed to authenticate')
    }
    spotify.searchTracks(`artist:${artistData.artist} ${artistData.song.title}`).then(
      data => {
        const artist = data?.body?.tracks?.items[0]?.artists[0]
        res(artist?.id)
      },
      err => {
        console.error('Error getting artist id ', err)
        rej(err)
      }
    )
  });
};

export const getArtistsMetadata = async artistIds => {
  const auth = await authenticate()
  return new Promise((res, rej) => {
    if (!auth) rej('Failed to authenticate')
    spotify.getArtists(artistIds).then(
      data => {
        res(data.body.artists.map(artist => ({
          genres: artist.genres,
          image: artist.images.length > 0 ? artist.images.pop() : null,
          artist: artist.name,
          spotifyId: artist.id
        })))
      },
      error => {
        console.error(error)
        rej(error)
      }
    )
  })
}
