import { ResponsiveBubbleHtml } from "@nivo/circle-packing";
import { useQuery } from "../hooks/useQuery";

import styles from "./styles.module.css";

const Bubble = ({ username }) => {
  const {data, loading, earliest, setEarliest, timeRanges} = useQuery('artisttree', username)

  if (loading) {
    return <div className={styles.loader} />;
  }

  const timeSelect = (
    <select value={earliest} onChange={(e) => setEarliest(e.target.value)}>
      {timeRanges.map(t => (<option value={t.value} >{t.label}</option>))}
    </select>
  )
  return (
    <div className="h-full w-full">
      {timeSelect}
      <ResponsiveBubbleHtml
        root={data.data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        identity="name"
        enableLabel={false}
        value="plays"
        colors={{ scheme: "category10" }}
        padding={8}
        labelSkipRadius={10}
        animate={true}
        motionStiffness={90}
        motionDamping={12}
      />
    </div>
  );
};

export default Bubble;
