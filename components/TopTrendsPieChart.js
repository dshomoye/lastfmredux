import { ResponsivePie } from "@nivo/pie";

import { useQuery } from "../hooks/useQuery";
import { QueryOps } from "../utils";

const getPieDataFromJson = (jsonData, mode) => {
  if (mode === QueryOps.topsongs) {
    return jsonData.map((playdata) => ({
      id: `${playdata.title}`,
      value: playdata.plays,
      artist: playdata.artist,
    }));
  } else if (mode === QueryOps.topartists) {
    return jsonData.map((d) => ({
      ...d,
      id: d.artist,
      value: d.plays,
    }));
  } else if (mode === QueryOps.topgenres) {
    return jsonData.map((d) => ({
      ...d,
      id: d.genre,
      value: d.plays,
    }));
  }
};

const ToolTip = (data, mode) => {
  if (mode === QueryOps.topsongs) {
    return (
      <div>
        <p>Artist: {data.artist}</p>
        <p>Title: {data.id}</p>
        <p>Played: {data.value} time(s)</p>
      </div>
    );
  } else if (mode === QueryOps.topartists) {
    return (
      <div>
        <p> Artist: {data.artist}</p>
        <p>Played: {data.value} time(s)</p>
      </div>
    );
  } else if (mode === QueryOps.topgenres) {
    return (
      <div>
        <p>Genre: {data.genre}</p>
        <p>Played: {data.value}</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>
          {data.id}:{data.value}
        </p>
      </div>
    );
  }
};

const chartModes = [
  {
    label: "Top Songs",
    value: QueryOps.topsongs,
  },
  {
    label: "Top Artists",
    value: QueryOps.topartists,
  },
  {
    label: "Top Genres",
    value: QueryOps.topgenres,
  },
];

const TopTrendsPieChart = ({ username }) => {
  const { data, earliest, setEarliest, timeRanges, setOp, op } = useQuery(
    QueryOps.topsongs,
    username,
    true
  );

  return (
    <div className="h-full w-full" id="topsongschart">
      <div className="my-2">
        <select value={earliest} onChange={(e) => setEarliest(e.target.value)}>
          {timeRanges.map((t) => (
            <option value={t.value} key={t.label}>
              {t.label}
            </option>
          ))}
        </select>
        <select onChange={e => setOp(e.target.value)}>
          {chartModes.map((m) => (
            <option value={m.value} key={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <ResponsivePie
        data={getPieDataFromJson(data.data, op)}
        innerRadius={0.5}
        cornerRadius={5}
        colors={{ scheme: "category10" }}
        sortByValue={true}
        margin={{
          bottom: 80,
          top: 40,
        }}
        padAngle={2}
        radialLabelsLinkDiagonalLength={10}
        radialLabelsLinkHorizontalLength={10}
        tooltip={(data) => ToolTip(data, op)}
      />
    </div>
  );
};

export default TopTrendsPieChart;
