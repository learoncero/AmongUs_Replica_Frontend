
import React from 'react';
import { Player } from './App';

type Props = {
    map: boolean[][],
    playerList: Player[],
    closeMiniMap: () => any,

};

const MiniMap: React.FC<Props> = ({ map, playerList }: Props) => {
    if (!Map) {
        return <div>Can`t show Minimap right now</div>;
    }

    return (
        <div className="MapDisplay-map-container minimap-container">
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
};

export default MiniMap;
