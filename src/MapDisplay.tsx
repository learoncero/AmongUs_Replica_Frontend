import {Player} from './App';
import './MapDisplay.css';


type Props = {
    map: boolean[][];
    playerList: Player[];
};


export default function MapDisplay({map, playerList}: Props) {

    if(!map) {
        return <div>Loading Map...</div>;
    }

    //console.log("PlayerList in MapDisplay: " + playerList[0].username + ", " + playerList[0].position.y);

    //console.log("Map data:", map);
    return (
        <div className="MapDisplay-map-container">
            {map.map((row, rowIndex) => (
                <div key={rowIndex} className="MapDisplay-row">
                    {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className={`MapDisplay-cell ${cell ? 'walkable' : 'obstacle'} ${playerList &&
                            playerList.some((player) => player.position.x === cellIndex && player.position.y === rowIndex) ? 'player' :''} '}`}/>
                    ))}
                </div>
            ))}

        </div>
    );
}