import { useState } from 'react';

export default function Button(props){

    //let counter = 1;
    const [counter, setCounter] = useState(1);

    //[estado, alterarestado]

    let increment = () =>{
        setCounter(counter + 1);
    }

    return(
        <>
        <span>{counter}</span>
        <button onClick={increment}>{props.children}</button>
        <br/>
        </>
        
    )
}