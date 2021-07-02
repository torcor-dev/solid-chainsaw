import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import ArmorSection from '../components/sections/ArmorSection'
import WeaponSection from '../components/sections/WeaponSection'

export default function Home() {
  return (
    <Layout>
      <ArmorSection />
      <WeaponSection />
    </Layout>
  )
}
