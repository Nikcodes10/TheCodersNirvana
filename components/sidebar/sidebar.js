import styles from './sidebar.module.css'

export default function Sidebar() {
    return (
    <section className={styles.sidebar}>
          <img loading="eager" src="/logo.jpeg"></img>
          <div>
              <h3>About</h3>
              <p>peer-to-peer learning circle jointly organized by<br></br> IEEE CET SB and IEEE MEC SB</p>
          </div>
    </section>
    )
}