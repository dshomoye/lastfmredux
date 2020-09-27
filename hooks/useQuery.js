import { useState } from "react";
import useSWR from "swr";
import { subYears, subMonths, subDays } from "date-fns";

const today = new Date();
const last7Days = subDays(today, 7).getTime();
const last30Days = subDays(today, 30).getTime();
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
    label: 'Last 6 months',
    value: last6Months
  },
  {
    label: 'Past Year',
    value: pastYear
  }
]

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const useQuery = (op, username) => {
  const [earliest, setEarliest] = useState(last7Days);
  const [limit, setLimit] = useState(op === 'artisttree' ? 100 :10)
  const { data, error } = useSWR(
    `/api/scrobbles/${username}/query?op=${op}&&from=${earliest}&limit=${limit}`,
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
  }
};

export { useQuery }