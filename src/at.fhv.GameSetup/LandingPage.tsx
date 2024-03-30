import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
        <Link to="/chooseGameMode" className="text-white hover:text-cyan-500 text-7xl font-bold">
        PLAY
      </Link>
    </div>
  );
}