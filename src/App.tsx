import { Route, Routes } from "react-router-dom";
import LandingPage from "./at.fhv.GameSetup/LandingPage";
import ChooseGameMode from "./at.fhv.GameSetup/ChooseGameMode";
import GameSetupPage from "./at.fhv.GameSetup/GameSetupPage";
import Lobby from "./at.fhv.GameSetup/Lobby";
import Game from "./Game";
import JoinGame from "./at.fhv.GameSetup/JoinGame";

export type Game = {
  gameCode: string;
  numberOfPlayers: number;
  numberOfImpostors: number;
  map: string;
  players: Player[];
};

export type Player = {
  id: number;
  username: string;
  x: number;
  y: number;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chooseGameMode" element={<ChooseGameMode />} />
      <Route path="/gameSetup" element={<GameSetupPage />} />
      <Route path="/lobby/:gameCode" element={<Lobby />} />
      <Route path="/game" element={<Game />} />
      <Route path="/joinGame" element={<JoinGame />} />
    </Routes>
  );
}
