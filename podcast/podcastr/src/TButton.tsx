import Welcome from "./Welcome";

type ButtonProps = {
  title: String;
}

function Button(props: ButtonProps){
  return(
    <button>{props.title}</button>
  );
}

//Fragmento
export default function TButton() {
  return (
    <>
    <h1>Hello World</h1>      
    <Welcome/>    
    </>      
  );
}

