import React, {useState, useEffect} from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

export type Player = {
    id: number;
    username: string,
    x: number;
    y: number;
};

export default function App() {
    const [nextID, setNextID] = useState(0);
    const [stompClient, setStompClient] = useState(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [playerList, setPlayerList] = useState<Player[]>([]);

    useEffect(() => {
        if (!stompClient) {
            const socket = new SockJS('http://localhost:5010/ws');
            const client = Stomp.over(socket);
            client.connect({}, () => {
                setStompClient(client);
            });

            return () => {
                if (stompClient) {
                    stompClient.disconnect();
                }
            };
        }
    }, [stompClient]); // Only run effect App is rendered

    useEffect(() => {
        if (stompClient) {
            const handleKeyDown = (event: { code: any; }) => {
                // Detect arrow key press
                const keyCode = event.code;
                let newPosition: { x: number; y: number; };
                switch (keyCode) {
                    case 'ArrowLeft': // Left arrow
                        move("left");
                        break;
                    case 'ArrowUp': // Up arrow
                        move("up");
                        break;
                    case 'ArrowRight': // Right arrow
                        move("right");
                        break;
                    case 'ArrowDown': // Down arrow
                        move("down");
                        break;
                    default:
                        return;
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [stompClient, player]);

    //Todo, update effect as it keeps rendering it, message.body is being printed in console 7x, maybe do set and update
    //functions outside of useEffect? does it need useEffect?
    useEffect(() => {
        if (stompClient) {
            stompClient.subscribe('/topic/positionChange', (message: { body: string; }) => {
                const receivedMessage = JSON.parse(message.body);
                const playerId = receivedMessage.id;
                const username = receivedMessage.username;
                console.log("Return message- ID: "+ playerId +" Username: "+ username +" X: "+ receivedMessage.position.x +" Y: "+ receivedMessage.position.y);
                const newPlayerPositionChange = {id: playerId, username: username, x: receivedMessage.position.x, y: receivedMessage.position.y};
                updatePlayerAndList(newPlayerPositionChange);
                /*if (receivedMessage.id === player.id) {
                    //console.log("setPlayer and updatePlayerList called")
                    setPlayer(newPlayerPositionChange);
                    updatePlayerList(newPlayerPositionChange);
                }*/
            });

            stompClient.subscribe('/topic/playerJoin', (message: { body: string; }) => {
                const receivedMessage = JSON.parse(message.body);
                updatePlayerList(receivedMessage);

                if (player && receivedMessage.id === player.id) {
                    setPlayer(receivedMessage);
                }
            });
        }
    }, [stompClient]);

    //for debugging
    /*useEffect(() => {
        if (player !== null) {
            console.log("updated Player State: " + player.x + ", " + player.y);
        }
    }, [player]);*/

    return (
        <div>

            <h1>Game</h1>
            <button onClick={() => joinGame(nextID, player)}>Join Game</button><br/>
            <button onClick={() => move('left')}>Move Left</button>
            <button onClick={() => move('up')}>Move Up</button>
            <button onClick={() => move('right')}>Move Right</button>
            <button onClick={() => move('down')}>Move Down</button>
        </div>
    );

    function joinGame(nextID: number, player: Player) {
        if(stompClient && player === null) {
            const playerID = nextID + 1;
            const newPlayer = {
                id: playerID,
                username: `Player ${playerID}`,
                x: 20,
                y: 20,
            };
            console.log("ID new Player: "+ playerID +" Username: "+ newPlayer.username +" X: "+ newPlayer.x +" Y: "+ newPlayer.y)
            setNextID(playerID); // Correctly update nextID
            setPlayer(newPlayer);
            updatePlayerList(newPlayer);
            stompClient.send('/app/join', {}, JSON.stringify(newPlayer));
        }

    }

    function updatePlayerList (updatedPlayer: { id: number; username: string; x: number; y: number; }) {

        const updatedPlayerList = [...playerList];
        const existingPlayerIndex = updatedPlayerList.findIndex(player => player.id === updatedPlayer.id);

        if (existingPlayerIndex !== -1) {
            updatedPlayerList[existingPlayerIndex] = updatedPlayer;
        } else {
            updatedPlayerList.push(updatedPlayer);
        }
        setPlayerList(updatedPlayerList);
    }


    function move(direction: string) {
        let deltaX = 0, deltaY = 0;

        // Determine the change in position based on the direction
        switch (direction) {
            case 'left':
                deltaX = -1;
                break;
            case 'up':
                deltaY = -1;
                break;
            case 'right':
                deltaX = 1;
                break;
            case 'down':
                deltaY = 1;
                break;
            default:
                return;
        }

        // Calculate the new position
        const newPlayerPosition = {
            x: player.x + deltaX,
            y: player.y + deltaY
        };

        // Send the move message
        stompClient.send('/app/move', {}, JSON.stringify({id: player.id, newPosition: newPlayerPosition }));
    }

    function  updatePlayerAndList(player){
        setPlayer(player);
        updatePlayerList(player);
    }


}
