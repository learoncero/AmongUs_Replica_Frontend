import { Link } from "react-router-dom";
import {useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage() {

    useEffect(() => {
        const uuid = uuidv4();
        sessionStorage.setItem('uuid', uuid); //TODO: Change to cookie
    }, []);

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
        <Link to="/chooseGameMode" className="text-white hover:text-cyan-500 text-7xl font-bold">
        PLAY
      </Link>
    </div>
  );
}