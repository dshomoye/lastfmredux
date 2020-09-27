import { ResponsiveCalendar } from "@nivo/calendar";
import { useQuery } from "../hooks/useQuery";
import { QueryOps } from "../utils";
import {format, addDays} from 'date-fns'

import styles from "./styles.module.css";

const Calendar = ({ username }) => {
  const {data, loading, earliest, latest} = useQuery(QueryOps.dailycount, username)
  const from = format(addDays(new Date(earliest),1), "yyyy-MM-dd")
  const to = format(new Date(latest), "yyyy-MM-dd")

  if (loading) {
    return <div className={styles.loader} />;
  }

  return (
    <ResponsiveCalendar
      data={data.data}
      from={from}
      to={to}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={40}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
    />
  );
};

export default Calendar;
