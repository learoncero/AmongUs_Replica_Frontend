import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Game} from "../App";

type Props = {
  nextPlayerID: number;
  incrementNextPlayerID: () => void;
  onChangeSetGame: (game: Game) => void;
};

export default function GameSetupPage({
  nextPlayerID,
  incrementNextPlayerID,
  onChangeSetGame,
}: Props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [numImpostors, setNumImpostors] = useState(0);
  const [map, setMap] = useState("Spaceship");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (username && numPlayers && numImpostors >= 0 && map) {
      if (numImpostors > numPlayers / 2) {
        setNumImpostors(Math.floor(numPlayers / 2));
      }
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [username, numPlayers, numImpostors, map]);

  function handleSubmit(event) {
    event.preventDefault();

    const gameData = {
      gameCode: 0,
      numberOfPlayers: numPlayers,
      numberOfImpostors: numImpostors,
      map: map,
      player: {
        id: nextPlayerID,
        username: username,
        position: {
          x: 9,
          y: 9,
        },
      }
    };

    incrementNextPlayerID();

    console.log("Creating game with data:", gameData);

    fetch("http://localhost:5010/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create game");
        }
        return response.json();
      })
      .then((game) => {
        onChangeSetGame(game);
        console.log("Game created, response from backend:", game);
        navigate(`/lobby/${game.gameCode}`);
      })
      .catch((error) => {
        console.error("Error creating game:", error);
        // Handle error
      });
  }

  return (
    <div className="min-h-screen bg-black flex justify-center pl-5 items-center">
      <div className="max-w-md text-white p-8 rounded-lg border-white border">
        <Link to="/chooseGameMode" className="text-white text-lg mb-4 block">
          Back
        </Link>
        <h2 className="text-3xl font-bold mb-4 text-white">Game Setup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-white" htmlFor="username">
              Player Name:
            </label>
            <input
              className="bg-gray-800 appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-lg mb-2 text-white"
              htmlFor="numPlayers"
            >
              Number of Players:
            </label>
            <input
              className="bg-gray-800 appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
              type="number"
              id="numPlayers"
              value={numPlayers}
              onChange={(e) => setNumPlayers(parseInt(e.target.value))}
              min="1"
              max="4"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-lg mb-2 text-white"
              htmlFor="numImpostors"
            >
              Number of Impostors:
            </label>
            <input
              className="bg-gray-800 appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
              type="number"
              id="numImpostors"
              value={numImpostors}
              onChange={(e) => setNumImpostors(parseInt(e.target.value))}
              min="0"
              max={numPlayers / 2}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-white" htmlFor="map">
              Map:
            </label>
            <select
              className="bg-gray-800 appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
              id="map"
              value={map}
              onChange={(e) => setMap(e.target.value)}
              required
            >
              <option value="Spaceship">Spaceship</option>
              {/* Add other map options here */}
            </select>
          </div>
          <button
            type="submit"
            disabled={buttonDisabled} // Disable the button based on buttonDisabled state
            className={`bg-transparent border border-white ${
              !buttonDisabled ? "hover:border-black hover:bg-cyan-500" : ""
            } text-white font-bold py-2 px-4 rounded-lg mt-4`}
          >
            Create Game
          </button>
        </form>
      </div>
    </div>
  );
}
