import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function JoinGame() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
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
  }, []);

  const handlePlayerNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleGameCodeChange = (event) => {
    setGameCode(event.target.value);
  };

  const isJoinDisabled = !(playerName && gameCode);

  const handleJoinGame = () => {
    if (!isJoinDisabled && stompClient) {
      const data = {
        username: playerName,
        position: {
          x: 10,
          y: 9,
        },
        gameCode: gameCode,
      };

      stompClient.send("/app/joinGame", {}, JSON.stringify(data));

      // Redirect to lobby
      navigate(`/lobby/${gameCode}`);
    }
  };

  // Handle the response to get the player ID from the header
  const handleJoinGameResponse = (message) => {
    const data = JSON.parse(message.body);
    const playerId = data.headers.playerId[0];
    console.log("Player ID received:", playerId);

    // Options
    // - Make sure playerId is only received by the joining player
    // - Join via REST endpoint, only handle players in lobby via websockets
    // - In lobby, call router.refresh() every 2s and not use web sockets

    if (playerId) {
      // Problem: Last joined player overrides all player ids
      // Store player ID in a cookie
      document.cookie = `playerId=${playerId}; path=/`;
      console.log("Player ID stored in cookie:", playerId);
    }
  };

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(
          "/topic/playerJoined",
          (message ) => {
            console.log("Received message: ", message);
            handleJoinGameResponse(message);
          }
      );
    }
  }, [stompClient]);

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="max-w-md text-white p-8 rounded-lg border-white border">
        <Link to="/chooseGameMode" className="text-white text-lg mb-4 block">
          Back
        </Link>
        <div className="w-96 flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={handlePlayerNameChange}
            className="bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center"
          />
          <input
            type="text"
            placeholder="Enter game code"
            value={gameCode}
            onChange={handleGameCodeChange}
            maxLength={6}
            className="bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center"
          />
          <button
            className={`bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center ${
              !isJoinDisabled
                ? "hover:border-black hover:bg-cyan-500"
                : "cursor-default"
            }`}
            onClick={handleJoinGame}
            disabled={isJoinDisabled}
          >
            JOIN GAME
          </button>
        </div>
      </div>
    </div>
  );
}
