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
    const [player, setPlayer] = useState({} as Player);
    const [playerList, setPlayerList] = useState([]);

    useEffect(() => {
        if (!stompClient) {
            const socket = new SockJS('http://localhost:5010/ws');
            const client = Stomp.over(socket);

            client.connect({}, () => {
                setStompClient(client);

                const playerID = nextID + 1;
                const newPlayer = {
                    id: playerID,
                    username: `Player ${playerID}`,
                    x: 20,
                    y: 20,
                };
                setNextID(playerID); // Correctly update nextID
                setPlayer(newPlayer);
                client.send('/app/join', {}, JSON.stringify(newPlayer));
            });

            return () => {
                if (stompClient) {
                    stompClient.disconnect();
                }
            };
        }
    }, [stompClient]); // Only run effect when stompClient changes

    useEffect(() => {
        if (stompClient) {
            const handleKeyDown = (event) => {
                // Detect arrow key press
                const keyCode = event.code;
                let newPosition;
                switch (keyCode) {
                    case 'ArrowLeft': // Left arrow
                        newPosition = { x: -1, y: 0 };
                        break;
                    case 'ArrowUp': // Up arrow
                        newPosition = { x: 0, y: -1 };
                        break;
                    case 'ArrowRight': // Right arrow
                        newPosition = { x: 1, y: 0 };
                        break;
                    case 'ArrowDown': // Down arrow
                        newPosition = { x: 0, y: 1 };
                        break;
                    default:
                        return;
                }
                // Send position update to server
                stompClient.send('/app/move', {}, JSON.stringify({ player, newPosition }));
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [stompClient, player]);

    useEffect(() => {
        if (stompClient) {
            stompClient.subscribe('/topic/positionChange', (message) => {
                const receivedMessage = JSON.parse(message.body);
                updatePlayerList(receivedMessage);

                if (player && receivedMessage.id === player.id) {
                    setPlayer(receivedMessage);
                }
            });

            stompClient.subscribe('/topic/playerJoin', (message) => {
                const receivedMessage = JSON.parse(message.body);
                updatePlayerList(receivedMessage);

                if (player && receivedMessage.id === player.id) {
                    setPlayer(receivedMessage);
                }
            });
        }
    }, [stompClient]);

    const updatePlayerList = (receivedMessage) => {
        const updatedPlayerList = [...playerList];
        const existingPlayerIndex = updatedPlayerList.findIndex(player => player.id === receivedMessage.id);

        if (existingPlayerIndex !== -1) {
            updatedPlayerList[existingPlayerIndex] = receivedMessage;
        } else {
            updatedPlayerList.push(receivedMessage);
        }

        setPlayerList(updatedPlayerList);
    };

    function move(direction) {
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
        stompClient.send('/app/move', {}, JSON.stringify({ player: { id: player.id }, newPosition: newPlayerPosition }));
    }

    return (
        <div>
            <h1>Game</h1>
            <button onClick={() => move('left')}>Move Left</button>
            <button onClick={() => move('up')}>Move Up</button>
            <button onClick={() => move('right')}>Move Right</button>
            <button onClick={() => move('down')}>Move Down</button>
        </div>
    );
}
