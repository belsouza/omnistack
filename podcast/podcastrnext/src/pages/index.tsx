import { GetStaticProps } from 'next';
import Image from 'next/image'; //exclusivo Next
import Link from 'next/link';
import {format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import dynamic from 'next/dynamic';
import Head from 'next/head';


import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../contexts/PlayerContext';

//SPA
//SSR
//SSG

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  //episodes: Array<Episode> //Episode[]
  latestEpisodes : Episode[]
  allEpisodes: Episode[]
}

/*
type HomeProps = {
  episodes: Array<{
    id: string;
    title: string;
    members: string;
  }>
}
*/

//export default function Home(props : HomeProps)

function Home({latestEpisodes, allEpisodes} : HomeProps) {


  const { playList }  = usePlayer();

  //Preservando a questão da imutabilidade do react
  const episodeList = [ ...latestEpisodes, ...allEpisodes ];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr </title>
      </Head>
     
     <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos </h2>
        <ul>
            { latestEpisodes.map( (episode, index) => {
              return(
                <li key={episode.id}>
                  <Image 
                    width={192}
                    height={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                   />
                  <div className={styles.episodeDetails}>
                      <Link href={`/episodes/${episode.id}`} >
                        <a>{episode.title}</a>
                      </Link>
                      <p>{episode.members}</p>
                      <span>{episode.publishedAt}</span>
                      <span>{episode.durationAsString}</span>
                  </div>

                  <button type='button' onClick={() => playList(episodeList, index)}>
                    <img src='/play-green.svg' alt='Tocar Episodio' />
                  </button>
                </li>
              )
            }) }
        </ul>

     </section>

     <section className={styles.allEpisodes}>
      <h2>Todos os episódios</h2>

      <table cellSpacing={0}>
        <thead>
          <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </tr>          
        </thead>
        <tbody>
          {
            allEpisodes.map((episode, index) => {
              return(
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`} >
                      <a>{episode.title}</a>
                    </Link>
                    
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type='button' onClick={ () => playList(episodeList, index + latestEpisodes.length)}>
                        <img src='/play-green.svg' alt='Tocar episodio' />
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>

     </section>
     
     
    </div>
   
  )
}

//export default Home;
export default dynamic(() => Promise.resolve(Home), { ssr: false});

export const getStaticProps : GetStaticProps = async () => {

  //const { data }  = await api.get('episodes?_limit=12&_sort=published_at&_order=desc');

  const { data }  = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  }); //depois de instalar axios e configurar no service
  //const data = await response.json()

  const episodes = data.map( episode =>{
    return {
      id: episode.id,
      title: episode. title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format( parseISO( episode.published_at ), 'd MMM yy', { locale: ptBR } ),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString( Number( episode.file.duration ) ),
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props:{
      //episodes,
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,

  }

}
