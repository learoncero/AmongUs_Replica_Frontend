/*
import { useState, useEffect } from "react";

import MapDisplay from "./MapDisplay";
import { Player, Game } from "./App";
import Stomp from "stompjs";




type Props = {
  game: Game;
  stompClient: Stomp.Client;
};

export default function Game({game, stompClient}: Props) {
  const [nextID, setNextID] = useState(0);
  // const [stompClient, setStompClient] = useState(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [GameMap, setGameMap] = useState<GameMap | null>(null);

  /!*useEffect(() => {
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
  }, [stompClient]); // Only run effect App is rendered*!/


  useEffect(() => {
    if (stompClient) {
      const handleKeyDown = (event: { code: any }) => {
        // Detect arrow key press
        const keyCode = event.code;
        switch (keyCode) {
          case "ArrowLeft": // Left arrow
            move("left");
            break;
          case "ArrowUp": // Up arrow
            move("up");
            break;
          case "ArrowRight": // Right arrow
            move("right");
            break;
          case "ArrowDown": // Down arrow
            move("down");
            break;
          default:
            return;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [stompClient, player]);

  //Todo, update effect as it keeps rendering it, message.body is being printed in console 7x, maybe do set and update
  //functions outside of useEffect? does it need useEffect?
  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(
        "/topic/positionChange",
        (message: { body: string }) => {
          const receivedMessage = JSON.parse(message.body);
          const playerId = receivedMessage.id;
          const username = receivedMessage.username;
          console.log(
            "Return message- ID: " +
              playerId +
              " Username: " +
              username +
              " X: " +
              receivedMessage.position.x +
              " Y: " +
              receivedMessage.position.y
          );
          const newPlayerPositionChange = {
            id: playerId,
            username: username,
            x: receivedMessage.position.x,
            y: receivedMessage.position.y,
          };
          updatePlayerAndList(newPlayerPositionChange);
        }
      );

      stompClient.subscribe(
        "/topic/mapinitialiser",
        (message: { body: string }) => {
          console.log("Map Initialiser called");
          console.log("message.body: " + message.body);
          const receivedMessage = JSON.parse(message.body);
          setGameMapState(receivedMessage);
        }
      );
    }
  }, [stompClient]);

  if (GameMap !== null) {
    console.log("GameMap: " + GameMap.map[3][3]);
    console.log("GameMap: " + GameMap.map[0][0]);
  }
  //for debugging
  /!*useEffect(() => {
        if (player !== null) {
            console.log("updated Player State: " + player.x + ", " + player.y);
        }
    }, [player]);*!/

  return (
    <div className="bg-black min-h-screen py-6 pl-6">
      <h1 className="mb-7 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
        Cloak and Dagger (CnD)
      </h1>
      <div className="text-white font-bold pb-6">
        <button
          className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg mr-4"
          onClick={() => joinGame(nextID, player)}
        >
          Join Game
        </button>
        <button
          className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => initialiseMap(GameMap)}
        >
          Get Map
        </button>
      </div>
      <MapDisplay Map={GameMap} playerList={playerList} />
    </div>
  );

  function initialiseMap(GameMap) {
    if (stompClient && GameMap === null) {
      stompClient.send("/app/mapinitialiser", {}, JSON.stringify({}));
    }
  }

  function joinGame(nextID: number, player: Player) {
    if (stompClient && player === null) {
      const playerID = nextID + 1;
      const newPlayer = {
        id: playerID,
        username: `Player ${playerID}`,
        x: 7,
        y: 9,
      };
      console.log(
        "ID new Player: " +
          playerID +
          " Username: " +
          newPlayer.username +
          " X: " +
          newPlayer.x +
          " Y: " +
          newPlayer.y
      );
      setNextID(playerID); // Correctly update nextID
      setPlayer(newPlayer);
      updatePlayerList(newPlayer);
      stompClient.send("/app/join", {}, JSON.stringify(newPlayer));
    }
  }

  function updatePlayerList(updatedPlayer: {
    id: number;
    username: string;
    x: number;
    y: number;
  }) {
    const updatedPlayerList = [...playerList];
    const existingPlayerIndex = updatedPlayerList.findIndex(
      (player) => player.id === updatedPlayer.id
    );

    if (existingPlayerIndex !== -1) {
      updatedPlayerList[existingPlayerIndex] = updatedPlayer;
    } else {
      updatedPlayerList.push(updatedPlayer);
    }
    setPlayerList(updatedPlayerList);
  }



  function updatePlayerAndList(player: Player) {
    setPlayer(player);
    updatePlayerList(player);
  }

  function setGameMapState(GameMap: GameMap) {
    setGameMap(GameMap);
  }
}
*/
