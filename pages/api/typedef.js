/**
 * @typedef {Object} Song
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * 
 * @typedef Scrobble
 * @property {Song} song
 * @property {Date} time
 * @property {string} username
 * 
 * @typedef SongPlays
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {Number} plays
 * 
 * @typedef ArtistPlays
 * @property {string} artist
 * @property {Number} plays
 * 
 * 
 * @typedef AlbumStats
 * @property {Number} value
 * @property {Object<string, SongPlays>} songs
 * 
 * @typedef ArtistStats
 * @property {Number} value
 * @property {Object<string, AlbumStats>} albums
 */
