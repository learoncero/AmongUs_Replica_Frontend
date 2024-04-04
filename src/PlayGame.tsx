import {Game} from "./App";
import Stomp from "stompjs";
import MapDisplay from "./MapDisplay";
import {useEffect} from "react";

type Props = {
    game: Game;
    stompClient: Stomp.Client;
};

export function PlayGame ({game, stompClient}:Props) {

    useEffect(() => {
        if (stompClient) {
            stompClient.subscribe(
                "/topic/positionChange",
                (message: { body: string }) => {
                    const receivedMessage = JSON.parse(message.body);
                    const playerId = receivedMessage.id;
                    const username = receivedMessage.username;
                    console.log(
                        "Return message- ID: " +
                        playerId +
                        " Username: " +
                        username +
                        " X: " +
                        receivedMessage.position.x +
                        " Y: " +
                        receivedMessage.position.y
                    );
                    const newPlayerPositionChange = {
                        id: playerId,
                        username: username,
                        x: receivedMessage.position.x,
                        y: receivedMessage.position.y,
                    };
                    updatePlayerInList(newPlayerPositionChange);
                }
            );
        }
    }, []);

    console.log("PlayGame rendered");
    console.log("Game in PlayGame: GameCode: "+game.gameCode + "Player1 username: " + game.players.at(0).username + "Position X: "+game.players.at(0).position.x);

    addEventListener("keydown", (event) => {
        switch (event.code) {
            case "ArrowLeft":
                console.log("ArrowLeft pressed");
                move(1, "left");
                break;
            case "ArrowRight":
                console.log("ArrowRight pressed");
                move(1, "right")
                break;
            case "ArrowUp":
                console.log("ArrowUp pressed");
                move(1, "up")
                break;
            case "ArrowDown":
                console.log("ArrowDown pressed");
                move(1, "down")
                break;
        }
    });

    //console.log("Map in PlayGame Game Component: "+game.map);
    return (
        <div>
            <h4>List of players:</h4>
            <ul>
                {game.players.map(player => (
                    <li key={player.id}>
                        {player.username}
                        {player.id === 1 ? " (you)" : ""}
                    </li>
                ))}
            </ul>

            <MapDisplay map={game.map} playerList={game.players} />
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

        const playerIndex = game.players.findIndex(player => player.id === playerId);
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
        }
    }

    function updatePlayerList(updatedPlayer: {
        id: number;
        username: string;
        x: number;
        y: number;
    }) {
        const updatedPlayerList = [...playerList];
        const existingPlayerIndex = updatedPlayerList.findIndex(
            (player) => player.id === updatedPlayer.id
        );

        if (existingPlayerIndex !== -1) {
            updatedPlayerList[existingPlayerIndex] = updatedPlayer;
        } else {
            updatedPlayerList.push(updatedPlayer);
        }
        setPlayerList(updatedPlayerList);
    }

    function updatePlayerInList(updatedPlayer: {
        id: number;
        username: string;
        x: number;
        y: number;
    }) {
        const updatedPlayerList = [...playerList];
        const existingPlayerIndex = updatedPlayerList.findIndex(
            (player) => player.id === updatedPlayer.id
        );

        if (existingPlayerIndex !== -1) {
            updatedPlayerList[existingPlayerIndex] = updatedPlayer;
        } else {
            updatedPlayerList.push(updatedPlayer);
        }
        setPlayerList(updatedPlayerList);
        //TODO update playerposition in list
    }
}