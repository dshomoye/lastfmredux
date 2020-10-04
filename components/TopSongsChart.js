import { ResponsivePie } from "@nivo/pie";

import styles from "./styles.module.css";
import { useQuery } from "../hooks/useQuery";

const getPieDataFromJson = (jsonData) => {
  return jsonData.map((playdata) => ({
    id: `${playdata.title}`,
    value: playdata.plays,
    artist: playdata.artist,
  }));
};

const TopSongsChart = ({ username }) => {
  const { data, loading, earliest, setEarliest, timeRanges } = useQuery(
    "topsongs",
    username
  );

  if (loading) {
    return <div className={styles.loader} />;
  }

  const timeSelect = (
    <select value={earliest} onChange={(e) => setEarliest(e.target.value)}>
      {timeRanges.map(t => (<option value={t.value} key={t.label} >{t.label}</option>))}
    </select>
  )

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="my-2">
        {timeSelect}
      </div>
      <ResponsivePie
        data={getPieDataFromJson(data.data)}
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
