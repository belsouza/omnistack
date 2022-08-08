import { createContext, ReactNode, useState, useContext } from 'react';
//Era ts e virou tsx porque quero que componentes funcionem aqui

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number; 
    isPlaying : boolean;
    isLooping: boolean;  
    isShuffling: boolean; 
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious : boolean;    
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext( {} as PlayerContextData);

export function PlayerContentProvider({ children } : PlayerContextProviderProps)
{
    //Variavel de estado
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);

  //Essa função vai ser chamada no index
  function play(episode : Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

   //Essa função deverá ser exportada, ou seja, irá pro contexto
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  //Pegar o evento e fazer toogle
  function setPlayingState( state: boolean ){
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext(){

    if(isShuffling){
        const nextRandomEpisodeIndex = Math.floor( Math.random()  * episodeList.length ) ;
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    }else if(hasNext){
       setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
       
  }

  function playPrevious()
  {
    if(hasPrevious)
    {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }    
  }

    return(
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            isPlaying,
            isLooping,
            isShuffling,
            playList, 
            playNext,
            playPrevious,
            togglePlay, 
            setPlayingState,
            hasNext,
            hasPrevious,            
            toggleLoop,
            toggleShuffle,
            clearPlayerState
            }}>
        { children }
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}