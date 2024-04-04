import {Game, Player} from "./App";
import Stomp from "stompjs";
import MapDisplay from "./MapDisplay";
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";

type Props = {
    game: Game;
    playerList: Array<Player>;
    onChangeUpdatePlayerList(playerList: Player[]) : void;
};

export function PlayGame ({game, playerList, onChangeUpdatePlayerList}:Props) {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if (!stompClient) {
            const socket = new SockJS("http://localhost:5010/ws");
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
    }, []);

    useEffect(() => {
        if (stompClient) {
            stompClient.subscribe(
                "/topic/positionChange",
                (message: { body: string }) => {
                    //console.log("Received message: " + message.body);
                    const receivedMessage = JSON.parse(message.body);
                    const playerId = receivedMessage.id;
                    const username = receivedMessage.username;
                    /*console.log(
                        "Return message- ID: " +
                        playerId +
                        " Username: " +
                        username +
                        " X: " +
                        receivedMessage.position.x +
                        " Y: " +
                        receivedMessage.position.y
                    );*/
                    const newPlayerPositionChange = {
                        id: playerId,
                        username: username,
                        position: {
                            x: receivedMessage.position.x,
                            y: receivedMessage.position.y,
                        }
                    };
                    updatePlayerInList(newPlayerPositionChange);
                }
            );
        }console.log("After setPlayerList:", playerList);
    }, [stompClient]);

    useEffect(() => {
        console.log("UseEffect for PlayerList at index[0]: "+playerList[0].username+" at position: "+playerList[0].position.x+", "+playerList[0].position.y);
    }, [playerList]);

    console.log("PlayGame rendered");
    console.log("After setPlayerList:", playerList);
    //this next log prints the old state so playerList in game.players is not updated
    console.log("Game in PlayGame: GameCode: "+game.gameCode + "Player1 username: " + game.players.at(0).username + "Position X, Y: "+game.players.at(0).position.x+", "+game.players.at(0).position.y);

    useEffect(() => {
        if (stompClient) {
            const handleKeyDown = (event: { code: any }) => {
                // Detect arrow key press
                const keyCode = event.code;
                switch (keyCode) {
                    case "ArrowLeft": // Left arrow
                        move(1,"left");
                        break;
                    case "ArrowUp": // Up arrow
                        move(1,"up");
                        break;
                    case "ArrowRight": // Right arrow
                        move(1,"right");
                        break;
                    case "ArrowDown": // Down arrow
                        move(1,"down");
                        break;
                    default:
                        return;
                }
            };

            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [stompClient]);



    //console.log("Map in PlayGame Game Component: "+game.map);
    return (
        <div>
            <h4>List of players:</h4>
            <ul>
                {playerList.map(player => (
                    <li key={player.id}>
                        {player.username}
                        {player.id === 1 ? " (you)" : ""}
                    </li>
                ))}
            </ul>

            <MapDisplay map={game.map} playerList={playerList} />
        </div>
    )

    function move(playerId: number, direction: string) {
        let deltaX = 0,
            deltaY = 0;

        // Determine the change in position based on the direction
        switch (direction) {
            case "left":
                deltaX = -1;
                break;
            case "up":
                deltaY = -1;
                break;
            case "right":
                deltaX = 1;
                break;
            case "down":
                deltaY = 1;
                break;
            default:
                return;
        }

        const playerIndex = playerList.findIndex(player => player.id === playerId);
        console.log("Move Function: playerIndex:"+playerIndex);
        // Calculate the new position
        if(playerIndex !== -1) {
            for (const p of playerList){
                console.log("Move Function playerList.at(playerIndex) User: " + p.username + " at position: " + p.position.x + ", " + p.position.y);
            }
            console.log("Move Function playerList.at(playerIndex).position.x: "+playerList.at(playerIndex).position.x);
            const newPlayerPosition = {
                x: playerList.at(playerIndex).position.x + deltaX,

                y: playerList.at(playerIndex).position.y + deltaY,
            };
                console.log("Move Function: getting new Coordinates with delta: " + newPlayerPosition.x +", " +newPlayerPosition.y)

            // Send the move message
            stompClient.send(
                "/app/move",
                {},
                JSON.stringify({id: playerId, newPosition: newPlayerPosition})
            );
        }
        /*const playerIndex = game.players.findIndex(player => player.id === playerId);
        // Calculate the new position
        if(playerIndex !== -1) {
            const newPlayerPosition = {
                x: game.players.at(playerIndex).position.x + deltaX,
                y: game.players.at(playerIndex).position.y + deltaY,
            };

            // Send the move message
            stompClient.send(
                "/app/move",
                {},
                JSON.stringify({id: playerId, newPosition: newPlayerPosition})
            );
        }*/
    }

    function updatePlayerInList(updatedPlayer: {
        id: number;
        username: string;
        position: {
            x: number;
            y: number;
        }
    }) {
        const updatedPlayerList = [...playerList];
        const updatedPlayerIndex = updatedPlayerList.findIndex(
            (player) => player.id === updatedPlayer.id
        );
        console.log("Updated player: "+updatedPlayer.username+" at position: "+updatedPlayer.position.x+", "+updatedPlayer.position.y);
        console.log("Updated player index: "+updatedPlayerIndex);
        if (updatedPlayerIndex !== -1) {
            updatedPlayerList[updatedPlayerIndex] = updatedPlayer;
        }

        console.log("Before setPlayerList:", playerList);
        onChangeUpdatePlayerList(updatedPlayerList);
        //game.players = updatedPlayerList;
        console.log("UpdatedPlayerList at index[0]: "+updatedPlayerList[0].username+" at position: "+updatedPlayerList[0].position.x+", "+updatedPlayerList[0].position.y)
    }


}