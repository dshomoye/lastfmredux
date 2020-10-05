import { useState } from "react";
import useSWR from "swr";
import { subYears, subMonths, subDays, startOfYear } from "date-fns";
import { QueryOps } from "../utils";

const today = new Date();
const last7Days = subDays(today, 7).getTime();
const last30Days = subDays(today, 30).getTime();
const last3Months = subMonths(today, 3).getTime();
const last6Months = subMonths(today, 6).getTime();
const pastYear = subYears(today, 1).getTime();

const timeRanges = [
  {
    label: 'Last 7 Days',
    value: last7Days
  },
  {
    label: 'Last 30 days',
    value: last30Days
  },
  {
    label : 'Last 3 months',
    value: last3Months
  },
  {
    label: 'Last 6 months',
    value: last6Months
  },
  {
    label: 'Past Year',
    value: pastYear
  }
]

const getQuery = (op, username, from=null, to=null, limit=null) => {
  let baseQ = `/api/scrobbles/${username}/query?op=${op}`
  if (from) baseQ += `&from=${from}`
  if (to) baseQ += `&to=${to}`
  if (op === QueryOps.dailycount) {
    return baseQ
  }
  if (limit) baseQ += `&limit=${limit}`
  return baseQ
}

const getEarliest = (op) => {
  if (op === QueryOps.dailycount) {
    return startOfYear(subYears(today, 1)).getTime()
  }
  return last7Days
}

const getLimit = op => {
  if (op === 'artisttree' ) {
    return 100
  } else if (op === 'genretree') {
    return 25
  }
  return 10
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const useQuery = (op, username) => {
  const [earliest, setEarliest] = useState(getEarliest(op));
  const [latest, setLatest] = useState(today.getTime())
  const [limit, setLimit] = useState(getLimit(op))
  const { data, error } = useSWR(
    getQuery(op, username, earliest, latest, limit),
    fetcher
  );

  return {
    data,
    error,
    loading: !error && !data,
    earliest,
    setEarliest,
    timeRanges,
    limit, 
    setLimit: v => {if (v > 0) setLimit(v)},
    latest, 
    setLatest,
  }
};

export { useQuery }