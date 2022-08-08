import './User.ts';
//Types não funcionam em js

function createWelcomeMessage(user: User){
    return `Bem-vindo ${user.name}, Cidade ${user.address.city}, Estado: ${user.address.state}` ;
}

export default function Welcome()
{
    const welcomeMessage = createWelcomeMessage({
        name: 'Bug',
        address: {
            city: 'Rio do sul',
            state: 'SC'
        }
    });

    return(
        <p>{welcomeMessage}</p>
    );
}