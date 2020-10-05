import Link from 'next/link'
import React from 'react'
import styles from '../styles/Home.module.css'

const Footer = () => (      <footer className={styles.footer}>
  <a
    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    target="_blank"
    rel="noopener noreferrer"
  >
    Powered by{' '}
    <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
  </a>
  <Link href="/">
    <a className="m-5 text-blue-600 underline">Go Home</a>
  </Link>
</footer>)

export default Footer
