import { Route, Routes } from "react-router-dom";
import LandingPage from "./at.fhv.GameSetup/LandingPage";
import ChooseGameMode from "./at.fhv.GameSetup/ChooseGameMode";
import Game from "./Game";
import GameSetupPage from "./at.fhv.GameSetup/GameSetupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chooseGameMode" element={<ChooseGameMode />} />
      <Route path="/game" element={<Game />} />
      <Route path="/gameSetup" element={<GameSetupPage />} />
    </Routes>
  );
}