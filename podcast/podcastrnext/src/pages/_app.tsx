import { Header } from '../components/Header/index';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { Player } from '../components/Player/index';
import { PlayerContentProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {

  
  return (
    <PlayerContentProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContentProvider>       
  );
}

export default MyApp
