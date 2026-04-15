import { useState } from 'react';
import React from "react";
import IslandCard from './IslandCard';

export default function IslandList({ islands }) {
    const [segment, setSegment] = useState("All");
    
    const displayed = 
        segment === 'All' ? islands : islands.filter(i => i.segment === segment);
    const segments = ['All', ...new Set(islands.map(i => i.segment))];

    const avgStay = displayed.length
        ? (displayed.reduce((sum, i) => sum + i.avgStay, 0)/ displayed.length).toFixed(1)
        : 0;
    
    return (
        <>
            <p><strong>Select Your Visitor Segment</strong></p>

            <select onChange={e => setSegment(e.target.value)}>
                {segments.map(s => <option key={s}>{s}</option>)}
            </select>

            <div className="grid">
                {displayed.map(island => (
                    <IslandCard key={island.id} {...island} />
                ))}
            </div>

            <div className="summary-card">
                <p><strong>Average stay for {segment === "All" ? "all segments" : segment}:</strong> {avgStay} days</p>
            </div>
        </>
    );
}
