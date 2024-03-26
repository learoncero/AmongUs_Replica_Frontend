import {GameMap, Player} from './App';
import './MapDisplay.css';


type Props = {
    Map: GameMap;
    playerList: Player[];
};


export default function MapDisplay({Map, playerList}: Props) {

    if(!Map) {
        return <div>Loading Map...</div>;
    }

    console.log("PlayerList in MapDisplay: " + playerList[0].x + ", " + playerList[0].y);

    return (
        <div className="MapDisplay-map-container">
            {Map.map.map((row, rowIndex) => (
                <div key={rowIndex} className="MapDisplay-row">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className={`MapDisplay-cell ${cell ? 'walkable' : 'obstacle'} ${playerList &&
                            playerList.some((player) => player.x === cellIndex && player.y === rowIndex) ? 'player' :''} '}`}/>
                    ))}
                </div>
            ))}

        </div>
    );
}