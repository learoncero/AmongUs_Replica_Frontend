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
        const playerId = sessionStorage.getItem('playerId'); //TODO: Change to cookie
        if (playerId) {
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
        // Subscribe to receive updated game state
        stompClient.subscribe(`/topic/${game.gameCode}/play`, (message: { body: string }) => {
            console.log("Game Message from Subscription to endpoint gamecode/play: " + message.body);
            const updatedGame = JSON.parse(message.body);
            onChangeSetGame(updatedGame);
        });
        //send game to backend to be updated
        console.log("sending game to backend...");
        stompClient.send(`/app/${game.gameCode}/play`, {}, JSON.stringify(game));
    }
  }, [stompClient]);
/*
  console.log("Cookie: ", document.cookie);
    const playerIdCookie = document.cookie
        .split(";")
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith("playerId="));
  console.log(playerIdCookie);
  const playerId = playerIdCookie ? parseInt(playerIdCookie.split("=")[1]) : null;
  const playerIndex = game.players.findIndex((player) => player.id === playerId);
*/

    const playerId = parseInt(sessionStorage.getItem('playerId')); //TODO: Change to cookie
    const playerIndex = game.players.findIndex((player) => player.id === playerId);

  return (
    <div className="min-h-screen bg-black text-white">
      <h4>List of players:</h4>
      <ul>
        {game.players.map((player) => (
          <li key={player.id}>
            Username: {player.username}
            {player.id === playerId ? " (you)" : ""}
          </li>
        ))}
      </ul>
        {/*TODO: implement ID search with Cookies*/}
      {game.players.at(playerIndex).role === "Impostor" ? <ImpostorView sabotages={game.sabotages}/> : <CrewmateView />  }
      <MapDisplay map={game.map} playerList={game.players} />
    </div>
  );

}