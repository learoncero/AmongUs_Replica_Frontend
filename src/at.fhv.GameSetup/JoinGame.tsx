import { Link } from "react-router-dom";
import { useState } from "react";

export default function JoinGame() {
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const handlePlayerNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleGameCodeChange = (event) => {
    setGameCode(event.target.value);
  };

  const isJoinDisabled = !(playerName && gameCode);

  return (
    <div className="bg-black flex justify-center items-center h-screen">
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
        <Link
          to={isJoinDisabled ? "#" : `/lobby/${gameCode}`} // Assuming the game code will be part of the route
          className={`bg-transparent border border-white text-white font-bold py-3 rounded-lg text-xl text-center ${
            !isJoinDisabled
              ? "hover:border-black hover:bg-cyan-500"
              : "cursor-default"
          }`}
          onClick={(e) => isJoinDisabled && e.preventDefault()} // Prevent navigation if the button is disabled
        >
          JOIN GAME
        </Link>
      </div>
    </div>
  );
}
