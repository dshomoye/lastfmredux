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
 * @param {WeeklySongPlays[]} data
 * @param {Number} top
 */
export const getWeeklySongsFromPlaytimes = (data, top = 3) => {
  const weeklyPlaytimes = groupBy(data, (d) => getDateOfISOWeek(d.week, d.year).getTime());
  Object.keys(weeklyPlaytimes).map((k) => {
    weeklyPlaytimes[k] = weeklyPlaytimes[k]
    .sort((a, b) => b.Playtimes - a.Playtimes)
    .slice(0, top);
  });
  const uniqueSongs = new Set()
  let result = Object.keys(weeklyPlaytimes).map(k => {
    const groupDate = new Date(parseInt(k))
    const id = `${groupDate.getMonth()}/${groupDate.getDate()}/${groupDate.getFullYear()}`
    const weekData = {id, timestamp: k}
    weeklyPlaytimes[k].map(listen => {
      const label = `${listen.artist}: ${listen.song}`
      weekData[label] = listen.playtimes
      uniqueSongs.add(label)
    })
    return weekData
  }).sort((a, b) => a.timestamp - b.timestamp)
  return {
    data: result,
    keys: [...uniqueSongs]
  }
};

export function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}