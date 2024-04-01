import { Link } from "react-router-dom";

export default function ChooseGameMode() {
  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="w-96 flex space-x-4">
        <Link
          to="/gameSetup"
          className="flex-1 bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-3 rounded-lg text-xl text-center"
        >
          CREATE GAME
        </Link>
        <Link
          to=""
          className="flex-1 bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-3 rounded-lg text-xl text-center"
        >
          JOIN GAME
        </Link>
      </div>
    </div>
  );
}
