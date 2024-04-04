import { Route, Routes } from "react-router-dom";
import LandingPage from "./at.fhv.GameSetup/LandingPage";
import ChooseGameMode from "./at.fhv.GameSetup/ChooseGameMode";
import GameSetupPage from "./at.fhv.GameSetup/GameSetupPage";
import Lobby from "./at.fhv.GameSetup/Lobby";
import JoinGame from "./at.fhv.GameSetup/JoinGame";
import {useState} from "react";
import {PlayGame} from "./PlayGame";

export type Game = {
  gameCode: string;
  numberOfPlayers: number;
  numberOfImpostors: number;
  map: boolean[][];
  players: Player[];
  gameID: number;
};

export type Player = {
  id: number;
  username: string;
  position: {x: number, y: number};
};

export default function App() {
  const [nextPlayerID, setNextPlayerID] = useState(1);
  const [game, setGame] = useState<Game | null>(null);
  const [playerList, setPlayerList] = useState<Player[]>([]);

  function incrementNextPlayerID() {
    setNextPlayerID(nextPlayerID + 1);
  }

  console.log("nextPlayerID", nextPlayerID);
  function onChangeUpdatePlayerList(currentPlayerList: Player[]) {
      console.log("onChangeUpdatePlayerList in App is called");
      setPlayerList(currentPlayerList);
  }

  function onCreationSetGame(gameCreated: Game) {
      setGame(gameCreated);
    }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chooseGameMode" element={<ChooseGameMode />} />
      <Route
        path="/gameSetup"
        element={
          <GameSetupPage
            nextPlayerID={nextPlayerID}
            incrementNextPlayerID={incrementNextPlayerID}
          />
        }
      />
      <Route
        path="/joinGame"
        element={
          <JoinGame
            nextPlayerID={nextPlayerID}
            incrementNextPlayerID={incrementNextPlayerID}
          />
        }
      />
      <Route
        path="/lobby/:gameCode"
        element={
          <Lobby
            game={game}
            onCreationSetGame={onCreationSetGame}
            playerList={playerList}
            onChangeUpdatePlayerList={onChangeUpdatePlayerList}/>} />
      <Route
        path="/:gamecode/play"
        element={
          <PlayGame
            game={game}
            playerList={playerList}
            onChangeUpdatePlayerList={onChangeUpdatePlayerList}/>} />
    </Routes>
  );
}
