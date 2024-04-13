import React, { useState, useEffect } from 'react';
import { Player } from './App';
import './MapDisplay.css';

const spriteImages = [
    '/src/Sprites/Red2.png',
    '/src/Sprites/Red3.png',
    '/src/Sprites/Red4.png',
    '/src/Sprites/Red5.png'


];

type Props = {
    map: boolean[][];
    playerList: Player[];

};


export default function MapDisplay({ map, playerList }: Props) {
    const [currentFrame, setCurrentFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((currentFrame) => (currentFrame + 1) % spriteImages.length);
        }, 250); // Wechselt das Sprite-Bild alle 250ms
        return () => clearInterval(interval);
    }, []);

    if (!map) {
        return <div>Loading Map...</div>;
    }

    const viewportSize = 11;  // Size of ViewPort
    const halfViewport = Math.floor(viewportSize / 2);

    const currentPlayer = playerList.find(player => player.id);
    if (!currentPlayer) {
        return <div>Player not found.</div>;
    }

    const { x, y } = currentPlayer.position;
    const startX = Math.max(0, x - halfViewport);
    const endX = Math.min(map[0].length, x + halfViewport + 1);
    const startY = Math.max(0, y - halfViewport);
    const endY = Math.min(map.length, y + halfViewport + 1);

    return (
        <div className="MapDisplay-map-container">
            {map.slice(startY, endY).map((row, rowIndex) => (
                <div key={rowIndex + startY} className="MapDisplay-row">
                    {row.slice(startX, endX).map((cell, cellIndex) => {
                        const isPlayerHere = playerList.some(player =>
                            player.position.x === cellIndex + startX &&
                            player.position.y === rowIndex + startY);
                        return (
                            <div
                                key={cellIndex + startX}
                                className={`MapDisplay-cell ${cell ? 'walkable' : 'obstacle'}`}
                                style={isPlayerHere ? {
                                    backgroundImage: `url(${spriteImages[currentFrame]})`,
                                    backgroundSize: 'cover'  // Stellt sicher, dass das Sprite die Zelle vollständig ausfüllt
                                } : {}}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
