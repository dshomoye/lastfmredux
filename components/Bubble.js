import { ResponsiveBubbleHtml } from "@nivo/circle-packing";
import { useQuery } from "../hooks/useQuery";

const Bubble = ({ username }) => {
  const {
    data,
    loading,
    earliest,
    setEarliest,
    timeRanges,
    limit,
    setLimit,
  } = useQuery("artisttree", username, true);

  return (
    <div className="h-full w-full">
      <div
        id="controls"
        className="flex my-2 border-solid justify-items-start mx-5"
      >
        <div className="flex-1">
          {
            <select
              value={earliest}
              onChange={(e) => setEarliest(e.target.value)}
            >
              {timeRanges.map((t) => (
                <option value={t.value} key={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          }
        </div>
        <div className="flex-1">
          <label htmlFor="limit">No. of songs</label>{" "}
          <input
            name="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="bg-gray-300 w-12"
            disabled={loading}
            step={50}
          />
        </div>
      </div>
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
