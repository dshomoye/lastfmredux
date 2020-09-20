import { mergeAll } from "rxjs/operators";
import { from } from "rxjs";
import { groupBy } from "lodash";

import "../pages/api/typedef";

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

/**
 *
 * @param {WeeklyListens[]} data
 * @param {Number} top
 */
export const getWeeklySongsFromListens = (data, top = 3) => {
  const weeklyListens = groupBy(data, (d) => `${d.year}-w${d.week}`);
  Object.keys(weeklyListens).map((k) => {
    weeklyListens[k] = weeklyListens[k]
    .sort((a, b) => b.listens - a.listens)
    .slice(0, top);
  });
  const uniqueSongs = new Set()
  let result = Object.keys(weeklyListens).map(k => {
    const weekData = {id: k}
    weeklyListens[k].map(listen => {
      const label = `${listen.artist}: ${listen.song}`
      weekData[label] = listen.listens
      uniqueSongs.add(label)
    })
    return weekData
  })
  return {
    data: result,
    keys: [...uniqueSongs]
  }
};
