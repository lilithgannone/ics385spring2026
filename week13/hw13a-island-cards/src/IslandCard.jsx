import React from "react";
// IslandCard.jsx — complete the JSX body
export default function IslandCard({ name, nickname, segment, avgStay, img, imgAlt }) {
    return (
        <div className="island-card">
            <img src={img} alt={imgAlt} />
            <h2>{name}</h2>
            <p>{nickname}</p>
            <p>{segment}</p>
            <p>{avgStay}</p>
        </div>
    );
}
