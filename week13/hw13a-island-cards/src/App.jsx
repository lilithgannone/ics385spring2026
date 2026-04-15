import React from "react";
import './App.css';
import IslandList from './IslandList';

const islands = [
    { 
        id: 1, 
        name: "Maui", 
        nickname: "Valley Isle",
        segment: "Honeymoon", 
        avgStay: 6.2, 
        img: "https://picsum.photos/300/200?random=1", 
        imgAlt: "Photo of Maui, Hawai'i" 
    },
    { 
        id: 2, 
        name: "O'ahu", 
        nickname: "Gathering Place",
        segment: "First-time", 
        avgStay: 4.8, 
        img: "https://picsum.photos/300/200?random=2", 
        imgAlt: "Photo of Oahu, Hawai'i" 
    },
    { 
        id: 3, 
        name: "Kaua'i", 
        nickname: "Garden Isle",
        segment: "Eco-tourist", 
        avgStay: 7.1, 
        img: "https://picsum.photos/300/200?random=3", 
        imgAlt: "Photo of Kaua'i, Hawa'i'"
    },
    { 
        id: 4, 
        name: "Hawai'i", 
        nickname: "Big Island",
        segment: "Adventure", 
        avgStay: 8.3, 
        img: "https://picsum.photos/300/200?random=4", 
        imgAlt: "Photo of Hawai'i Island, Hawai'i" },
    { 
        id: 5, 
        name: "Lana'i", 
        nickname: "The Pineapple Isle",
        segment: "Leisure", 
        avgStay: 9.2, 
        img: "https://picsum.photos/300/200?random=5", 
        imgAlt: "Photo of Lana'i, Hawai'i" 
    },

];

export default function App() {
    return (
        <>
        <IslandList islands={islands}/>
        </>
    );
}

