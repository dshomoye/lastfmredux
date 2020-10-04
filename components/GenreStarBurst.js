import React from 'react'

import { useQuery } from '../hooks/useQuery'
import styles from "./styles.module.css";

const GenreStarBurst = ({ username }) => {
  const {data, loading} = useQuery('genretree', username);

  if (loading) return <div className={styles.loader} />
  console.log(data)
  
  return <div>Sun burst here</div>
}

export default GenreStarBurst;
