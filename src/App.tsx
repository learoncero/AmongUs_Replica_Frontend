import { Route, Routes } from "react-router-dom";
import LandingPage from "./at.fhv.GameSetup/LandingPage";
import ChooseGameMode from "./at.fhv.GameSetup/ChooseGameMode";
import GameSetupPage from "./at.fhv.GameSetup/GameSetupPage";
import Lobby from "./at.fhv.GameSetup/Lobby";
import Game from "./Game";

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
      <Route path="/game/game" element={<Game />} />
    </Routes>
  );
}
