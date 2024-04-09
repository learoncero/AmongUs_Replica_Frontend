import { Route, Routes } from "react-router-dom";
import LandingPage from "./at.fhv.GameSetup/LandingPage";
import ChooseGameMode from "./at.fhv.GameSetup/ChooseGameMode";
import GameSetupPage from "./at.fhv.GameSetup/GameSetupPage";
import Lobby from "./at.fhv.GameSetup/Lobby";
import JoinGame from "./at.fhv.GameSetup/JoinGame";
import { useState } from "react";
import { PlayGame } from "./PlayGame";

export type Game = {
  gameCode: string;
  numberOfPlayers: number;
  numberOfImpostors: number;
  map: boolean[][];
  players: Player[];
  gameID: number;
  sabotages: Sabotage[];
};

export type Player = {
  id: number;
  username: string;
  position: { x: number; y: number };
  role: string;
};

export type Sabotage = {
  id: number;
  title: string;
  description: string;
};

export default function App() {
  const [game, setGame] = useState<Game | null>(null);

  function onChangeSetGame(gameCreated: Game) {
    setGame(gameCreated);
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chooseGameMode" element={<ChooseGameMode />} />
      <Route
        path="/gameSetup"
        element={<GameSetupPage onChangeSetGame={onChangeSetGame} />}
      />
      <Route path="/joinGame" element={<JoinGame />} />
      <Route
        path="/lobby/:gameCode"
        element={<Lobby game={game} onChangeSetGame={onChangeSetGame} />}
      />
      <Route
        path="/:gamecode/play"
        element={<PlayGame game={game} onChangeSetGame={onChangeSetGame} />}
      />
    </Routes>
  );
}
