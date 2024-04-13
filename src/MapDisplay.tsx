import {Player} from './App';
import './MapDisplay.css';

type Props = {
    map: boolean[][];
    playerList: Player[];

};

export default function MapDisplay({ map, playerList }: Props) {
    if (!map) {
        return <div>Loading Map...</div>;
    }

    const viewportSize = 11;  // Size of ViewPort
    const halfViewport = Math.floor(viewportSize / 2);

    // Which player to focus
    const currentPlayer = playerList.find(player => player.id );
    if (!currentPlayer) {
        return <div>Player not found.</div>;
    }

    const { x, y } = currentPlayer.position;

    // Calculate Area
    const startX = Math.max(0, x - halfViewport);
    const endX = Math.min(map[0].length, x + halfViewport + 1);
    const startY = Math.max(0, y - halfViewport);
    const endY = Math.min(map.length, y + halfViewport + 1);

    return (
        <div className="MapDisplay-map-container">
            {map.slice(startY, endY).map((row, rowIndex) => (
                <div key={rowIndex + startY} className="MapDisplay-row">
                    {row.slice(startX, endX).map((cell, cellIndex) => (
                        <div
                            key={cellIndex + startX}
                            className={`MapDisplay-cell ${cell ? 'walkable' : 'obstacle'} ${
                                playerList.some(player =>
                                    player.position.x === cellIndex + startX &&
                                    player.position.y === rowIndex + startY) ? 'player' : ''
                            }`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
