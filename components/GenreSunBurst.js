import React, { useEffect, useRef, useState } from "react";

import { useQuery } from "../hooks/useQuery";
import { stringToColor } from "../utils";
import Loading from "./Loading";

const GenreSunBurst = ({ username }) => {
  const {
    data,
    loading,
    earliest,
    setEarliest,
    timeRanges,
    limit,
    setLimit,
  } = useQuery("genretree", username);

  const [initialized, setInitialized] = useState(false);
  const chartRef = useRef();

  useEffect(() => {
    // clear div before rerendering chart
    if (initialized) chartRef.current.innerHTML = "";
    const init = async () => {
      const SunBurst = (await import("sunburst-chart")).default;
      const GSun = SunBurst();
      if (data) {
        GSun.data(data.data)
          .height(chartRef.current.clientHeight)
          .width(chartRef.current.clientHeight)
          .size("plays")
          .color(n => stringToColor(n.name))(chartRef.current);
        setInitialized(true);
      }
    };
    init();
  }, [data, chartRef]);

  return (
    <div className="h-full w-full" id="genresunburst">
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
            step={25}
            min={5}
          />
        </div>
      </div>
      {loading || !initialized ? <Loading /> : null}
      <div
        ref={chartRef}
        className="w-full h-64 my-5 pt-5 svg-center"
        id="sunburst-container"
      ></div>
    </div>
  );
};

export default GenreSunBurst;
