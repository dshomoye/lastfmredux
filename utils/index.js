import { mergeAll, map, catchError, mergeMap, delay, concatMap } from "rxjs/operators";
import { asyncScheduler, from, of, scheduled } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { chunk } from 'lodash'

import "../pages/api/typedef";

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max))

export function saveScrobbles(username, totalPages, fromTime) {
  let currentPage = totalPages;
  const promises = [];
  while (currentPage > 0) {
    const p = fetch(`/api/scrobbles/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: currentPage,
        from: fromTime,
      }),
    });
    promises.push(p);
    currentPage -= 1;
  }
  return from(promises).pipe(mergeAll());
}

export function getUntaggedArtistIds() {
  return fromFetch("/api/metadata?op=untaggedartists").pipe(
    mergeMap((res) => {
      return res.json();
    }),
    concatMap((untaggedData) =>
      from(untaggedData.data).pipe(
        concatMap(artistData => of(artistData).pipe(
          delay(10),
          concatMap(artistData => 
            fromFetch("/api/metadata?op=getartistspotifyid", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(artistData),
            }).pipe(
              concatMap((res) => res.json()),
              map((d) => d.data)
            )
          ))
        )
      )
    ),
    catchError((err) => {
      console.error(err);
      return of({ error: true, message: err.message });
    })
  );
}

/**
 * 
 * @param {string[]} artistIds 
 */
export const updateArtistsMetadata = artistIds => {
  const slices = chunk(artistIds, 49)
  console.log('slices ', slices)
  return from(slices).pipe(
    concatMap(artistSlice => of(artistSlice).pipe(
      delay(10),
      concatMap(artistSlice => 
        fromFetch('/api/metadata?op=updateartists', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({artistIds: artistSlice})
        }).pipe(
          concatMap(res => res.json()),
          map(d => d.data)
        )
      )
    ))
  )
}

export const QueryOps = {
  topsongs: "topsongs",
  artisttree: "artisttree",
  dailycount: "dailycount",
};

export const MetadataOps = {
  untaggedartists: "untaggedartists",
  updateartists: "updateartists",
  getartistspotifyid: "getartistspotifyid",
};
