import { Sidebar } from '../components'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [animation, setAnimation] = useState(styles.fadeIn);
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Sidebar></Sidebar>      
      <main className={styles.flex + ' ' + animation}>
        <div>
          <p>Let this leaderboard be a source of motivation for developing your coding skills. Work your way to the top and showcase your determination!</p>
          <button onClick={
            ()=>{
            setAnimation(styles.exit); 
            setTimeout(()=>{
              router.push('leaderboard')
            },1000)
          }}>
          LEADERBOARD</button>
        </div>
      </main>
    </div>
  )
}
