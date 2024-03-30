import { Link } from "react-router-dom";

export default function GameSetupPage() {
    return (
        <div className="min-h-screen bg-black flex justify-center pl-5 items-center">
            <div className="max-w-md text-white p-8 rounded-lg border-white border">
                <h2 className="text-3xl font-bold mb-4 text-white">Game Setup</h2>
                <div className="mb-4">
                    <p className="text-lg"><strong>Player name:</strong> Player 1</p>
                    <p className="text-lg"><strong>Number of players:</strong> 1</p>
                    <p className="text-lg"><strong>Number of impostors:</strong> 0</p>
                    <p className="text-lg"><strong>Map:</strong> Spaceship</p>
                </div>
                <Link
                    to="/game"
                    className="bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg inline-block"
                >
                    Create Game
                </Link>
            </div>
        </div>
    );
}