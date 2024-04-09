import { Game } from "./App";
import Stomp from "stompjs";
import MapDisplay from "./MapDisplay";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import CrewmateView from "./CrewmateView";
import ImpostorView from "./ImpostorView";

type Props = {
  game: Game;
  onChangeSetGame(game: Game): void;
};

export function PlayGame({ game, onChangeSetGame }: Props) {
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

    function handleKeyDown(event: KeyboardEvent) {
        const keyCode = event.code;
        const playerIdCookie = document.cookie.split(";").find(cookie => cookie.trim().startsWith("playerId="));
        if (playerIdCookie) {
            const playerId = playerIdCookie.split("=")[1];
            // Send move message to server
            const moveMessage = {
                id: playerId,
                keyCode: keyCode,
                gameCode: game.gameCode,
            };
            if (stompClient && game.players.length > 0 && playerId) {
                stompClient.send("/app/move", {}, JSON.stringify(moveMessage));
            }
        }
    }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stompClient, game.players]);

    useEffect(() => {
        if (stompClient) {
            stompClient.subscribe(
                "/topic/positionChange",
                (message: { body: string }) => {
                    const receivedMessage = JSON.parse(message.body);
                    console.log("Received message: ", receivedMessage);
                    onChangeSetGame(receivedMessage);
                }
            );
        }
    }, [stompClient]);
/*
    useEffect(() => {
        console.log(
            "UseEffect for game.players at index[0]: " +
            game.players[0].username +
            " at position: " +
            game.players[0].position.x +
            ", " +
            game.players[0].position.y
        );
    }, [game]);

    console.log("PlayGame rendered");
    console.log(
        "Game in PlayGame after rendering: GameCode: " +
        game.gameCode +
        "Player1 username: " +
        game.players.at(0).username +
        "Position X, Y: " +
        game.players.at(0).position.x +
        ", " +
        game.players.at(0).position.y
    );
*/
  //console.log("Map in PlayGame Game Component: "+game.map);

  // TODO: Implement role assignment
  const role = "Impostor";

  return (
    <div className="min-h-screen bg-black text-white">
      <h4>List of players:</h4>
      <ul>
        {game.players.map((player) => (
          <li key={player.id}>
            {player.username}
            {player.id === 1 ? " (you)" : ""}
          </li>
        ))}
      </ul>
      {role === "Impostor" && <ImpostorView sabotages={game.sabotages} />}
      {role === "Crewmate" && <CrewmateView />}
      <MapDisplay map={game.map} playerList={game.players} />
    </div>
  );

  function updatePlayerInList(updatedPlayer: {
    id: number;
    username: string;
    position: {
      x: number;
      y: number;
    };
  }) {
    const updatedGame = { ...game };
    const updatedPlayerList = [...game.players];
    const updatedPlayerIndex = updatedPlayerList.findIndex(
      (player) => player.id === updatedPlayer.id
    );
    console.log(
      "Updated player: " +
        updatedPlayer.username +
        " at position: " +
        updatedPlayer.position.x +
        ", " +
        updatedPlayer.position.y
    );
    console.log("Updated player index: " + updatedPlayerIndex);
    if (updatedPlayerIndex !== -1) {
      updatedPlayerList[updatedPlayerIndex] = updatedPlayer;
    }
    updatedGame.players = updatedPlayerList;

    console.log("Before setPlayerList:", game.players);
    onChangeSetGame(updatedGame);
    console.log(
      "UpdatedPlayerList at index[0]: " +
        updatedPlayerList[0].username +
        " at position: " +
        updatedPlayerList[0].position.x +
        ", " +
        updatedPlayerList[0].position.y
    );
  }
}