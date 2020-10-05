import React from 'react'
import { ResponsiveTreeMap } from '@nivo/treemap'

import { useQuery } from '../hooks/useQuery'
import styles from "./styles.module.css";


const GenreStarBurst = ({ username }) => {
  const {data, loading, earliest, setEarliest, timeRanges, limit, setLimit} = useQuery('genretree', username);
  
  const timeSelect = (
    <select value={earliest} onChange={(e) => setEarliest(e.target.value)}>
      {timeRanges.map((t) => (
        <option value={t.value} key={t.label}>{t.label}</option>
      ))}
    </select>
  );

  if (loading) return <div className={styles.loader} />
  
  return (
    <div className="h-full w-full">
      <div
        id="controls"
        className="flex my-2 border-solid justify-items-start mx-5"
      >
        <div className="flex-1">{timeSelect}</div>
        <div className="flex-1">
          <label htmlFor="limit">No. of songs</label>{" "}
          <input
            name="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="bg-gray-300 w-12"
            disabled={loading}
            step={25}
            min={5}
          />
        </div>
      </div>
      <ResponsiveTreeMap
        root={data.data}
        identity="name"
        value="plays"
        innerPadding={5}
        outerPadding={5}
        label="plays"
        tooltip={d => <p>{d.id}</p>}
        colors={{ scheme: 'accent' }}
      />
    </div>
  )
}

export default GenreStarBurst;
