import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";
import {subDays} from 'date-fns'

import styles from './styles.module.css'

const getPieDataFromJson = (jsonData) => {
  return jsonData.map((playdata) => ({
    id: `${playdata.title}`,
    value: playdata.plays,
    artist: playdata.artist,
  }));
};

const TopSongsChart = ({ username }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [daysRange, setDaysRange] = useState(7)

  const handleDaysRangeChange = event => {setDaysRange(event.target.value)}

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const earliest = subDays(new Date(), daysRange).getTime()
      const response = await fetch(
        `/api/scrobbles/sonofatailor/query?op=topsongs&username=${username}&from=${earliest}`
      );
      const result = await response.json();
      const pieData = getPieDataFromJson(result.data);
      setData(pieData);
      setLoading(false);
    };
    fetchData();
  }, [username, daysRange]);

  if(loading) {
    return <div className={styles.loader} />
  }

  return (
    <div style={{height: '100%', width: '100%'}}>
      <select name="time range" id="timerange" onChange={handleDaysRangeChange} value={daysRange}>
        <option value={7}>Last 7 days</option>
        <option value={30}>Last 30 days</option>
        <option value={60}>Last 60 days</option>
      </select>
    <ResponsivePie
      data={data}
      innerRadius={0.5}
      cornerRadius={5}
      colors={{ scheme: "category10" }}
      sortByValue={true}
      margin={{
        bottom: 40,
        top: 40,
      }}
      padAngle={2}
      radialLabelsLinkDiagonalLength={10}
      radialLabelsLinkHorizontalLength={10}
      tooltip={(data) => (
        <div>
          <p>Artist: {data.artist}</p>
          <p>Title: {data.id}</p>
          <p>Played: {data.value} time(s)</p>
        </div>
      )}
      />
      </div>
  );
};

export default TopSongsChart;
