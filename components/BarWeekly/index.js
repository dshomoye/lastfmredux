import { ResponsiveBar } from '@nivo/bar'
import {useEffect, useState} from 'react'

import {getWeeklySongsFromListens} from '../../utils'
import styles from './styles.module.css'

const sample = [
  {
    id: '1',
    'Life': 4,
    'Baby': 2,
  },
  {
    id: '2',
    'Begining': 1,
    'Joy': 5
  },
  {
    id: '3',
    'Begining': 1,
    'Joy': 5
  }
]

const BarWeekly = () => {
  const [ data, setData] = useState(sample)
  const [keys, setKeys] = useState(['Life', 'Baby', 'Begining', 'Joy'])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      const response = await fetch('/api/scrobbles/sonofatailor/query')
      const responseData = await response.json()
      const {data: rdata, keys: rkeys} = getWeeklySongsFromListens(responseData.data)
      setData(rdata);
      setKeys(rkeys);
      setLoading(false)
    }
    getData()
  },[])

  if(loading) {
    return <div className={styles.loader}/>
  }

  return (
    <ResponsiveBar
    data={data}
    keys={keys}
    indexBy='id'
    margin={{ top: 50, right: 250, bottom: 50, left: 50 }}
    axisBottom={{
      legend: 'WeekOf',
      legendOffset: 35,
      legendPosition: 'middle'
    }}
    axisLeft={{
      legend: 'Times Played',
      legendOffset: -35,
      legendPosition: 'middle'
    }}
    colors={{ scheme: 'paired' }}
    legends={[{
      dataFrom: 'keys',
      anchor: 'bottom-right',
      direction: 'column',
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
    }]}
  />
  )
}

export default BarWeekly;
