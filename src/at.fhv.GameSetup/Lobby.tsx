import { useEffect} from "react";
import { useParams, useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {Game} from "../App";

type Props = {
  game: Game;
  setGame: (game: Game) => void;
  stompClient: Stomp.Client;
  setStompClient: (stompClient: Stomp.Client) => void;
};

export default function Lobby({game, setGame, stompClient, setStompClient}: Props) {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  useEffect(() => {
    console.log("useEffect triggered");

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
        setGame(gameData);
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
      });
  }, [gameCode, setGame]);

  function handleStartGame(event) {
    event.preventDefault();
    console.log("Starting game... Data:", game);

      if (!stompClient) {
          const socket = new SockJS("http://localhost:5010/ws");
          const client = Stomp.over(socket);
          client.connect({}, () => {
              setStompClient(client);
          });
          console.log("Game connection established upon pressing StartGame in Lobby");
      }
  }

    useEffect(() => {
        console.log("useEffect triggered: StompClient is set.");
        if(stompClient){
            console.log("Game being sent: ", game);
            sendGameToServerAndGoToGame(game);
        }
    }, [stompClient]);

  function sendGameToServerAndGoToGame(game: Game) {
    if (stompClient) {
      console.log("sending game to backend...");
      stompClient.send(`/app/${gameCode}/play`, {}, JSON.stringify(game));
      navigate(`/${game.gameCode}/play`);
    }
  }
  const isGameReadyToStart = game?.numberOfPlayers === game?.players.length;

  return (
    <div className="min-h-screen bg-black flex justify-center pl-5 items-center gap-10">
      <div className="max-w-xl text-white p-8 rounded-lg border-white border flex flex-col grow h-96">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Players ({game?.players.length}/{game?.numberOfPlayers})
          </h2>
          <hr className="border-white mb-4" />
          {game && (
            <>
              {game.numberOfPlayers === game.players.length ? (
                <p className="pb-4">You can start the game!</p>
              ) : (
                <p className="pb-4">Waiting for players...</p>
              )}
              <ul className="list-none p-0">
                {game.players.map((player) => (
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
