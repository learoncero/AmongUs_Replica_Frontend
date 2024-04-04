import {useEffect, useState} from "react";
import { useParams, useNavigate} from "react-router-dom";
import { Game, Player } from "../App";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

type Props = {
  game: Game;
  onCreationSetGame: (game: Game) => void;
  playerList: Player[];
  onChangeUpdatePlayerList: (playerList: Array<Player>) => void;
};

export default function Lobby({game, onCreationSetGame, playerList, onChangeUpdatePlayerList}: Props) {
  const [stompClient, setStompClient] = useState(null);
  const navigate = useNavigate();
  const { gameCode } = useParams();

  useEffect(() => {
    if (!stompClient) {
      const socket = new SockJS("http://localhost:5010/ws");
      const client = Stomp.over(socket);
      client.connect({}, () => {
        setStompClient(client);
      });

      return () => {
        if(stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, []);

  /*useEffect(() => {
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
  }, [setStompClient, stompClient]);*/

  useEffect(() => {
    if (!stompClient) return;

    stompClient.subscribe(
      "/topic/playerJoined",
      (message: { body: string }) => {
        const receivedMessage = JSON.parse(message.body);
        onCreationSetGame(receivedMessage.body);
        onChangeUpdatePlayerList(receivedMessage.body.players); // Update playerList state
      }
    );
  }, [stompClient]);

  useEffect(() => {
    const apiUrl = `http://localhost:5010/api/game/${gameCode}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch game data: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((gameData) => {
        onCreationSetGame(gameData);
        onChangeUpdatePlayerList(gameData.players);
        console.log("Game data fetched:", gameData);
        console.log("PlayerData: " + gameData.players);
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
      });
  }, [gameCode, onCreationSetGame]);

  function handleStartGame(event) {
    event.preventDefault();
    console.log("Game being sent: ", game);
    sendGameToServerAndGoToGame(game);
  }

  function sendGameToServerAndGoToGame(game: Game) {
    if (stompClient) {
      console.log("sending game to backend...");
      stompClient.send(`/app/${gameCode}/play`, {}, JSON.stringify(game));
      navigate(`/${game.gameCode}/play`);
      console.log("Start Game button handler: Game sent to backend!" + game);
    }
  }
  const isGameReadyToStart = game?.numberOfPlayers === game?.players.length;

  return (
    <div className="min-h-screen bg-black flex justify-center pl-5 items-center gap-10">
      <div className="max-w-xl text-white p-8 rounded-lg border-white border flex flex-col grow h-96">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Players ({playerList.length}/{game?.numberOfPlayers})
          </h2>
          <hr className="border-white mb-4" />
          {game && (
            <>
              {game.numberOfPlayers === playerList.length ? (
                <p className="pb-4">You can start the game!</p>
              ) : (
                <p className="pb-4">Waiting for players...</p>
              )}
              <ul className="list-none p-0">
                {playerList.map((player) => (
                  <li
                    key={player.id}
                    className="mb-2 px-4 py-2 bg-gray-800 rounded-lg"
                  >
                    {player.username}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="text-white flex flex-col justify-between">
        <p className="text-lg font-bold mb-4">
          Game Code:{" "}
          <span className="bg-gray-800 rounded-lg p-2 text-lg font-bold">
            {gameCode}
          </span>
        </p>
        <button
          onClick={handleStartGame}
          className={`bg-transparent border border-white ${
            isGameReadyToStart ? "hover:border-black hover:bg-cyan-500" : ""
          } text-white font-bold py-2 px-4 rounded-lg mt-4`}
          disabled={!isGameReadyToStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
