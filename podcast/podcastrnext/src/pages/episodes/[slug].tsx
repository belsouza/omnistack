import { GetStaticProps, GetStaticPaths } from 'next';
import { api } from '../../services/api';
import {format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import styles from './episode.module.scss';
import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';


type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
 };
  
type EpisodeProps = {
    episode: Episode;
}


export default function Episode({ episode } : EpisodeProps){

   // const router = useRouter();
   //  if(router.isFallback) {  return "<p>Carregando</p>";    }

   const {  play } = usePlayer();
    return(
        <div className={styles.episode}>


        <Head>
            <title>{episode.title} | Podcastr </title>
        </Head>

            <div className={styles.thumbnailContainer}>

                <Link href="/">
                    <button type='button' onClick={ () => play(episode)}>
                        <img src="/arrow-left.svg" alt="Voltar" />                    
                    </button>                
                </Link>
               
              
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"                    
                />

                <button type='button'>
                    <img src="/play.svg" alt="Tocar episódio" />                    
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html:episode.description }} />
         
            
        </div>
        
    )
}


export const getStaticPaths : GetStaticPaths = async () => {


    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map( episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths, // { params: { slug: "a-importancia-da-contribuicao-em-open-source"   } }
        fallback: 'blocking'
       // fallback: true,
    }
}


export const getStaticProps : GetStaticProps = async (ctx) => {

    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {      
        id: data.id,
        title: data. title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format( parseISO( data.published_at ), 'd MMM yy', { locale: ptBR } ),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString( Number( data.file.duration ) ),
        description: data.description,
        url: data.file.url,       
    };

    return{
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 //24horas
    }
}




