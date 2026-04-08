import React from "react";
import Header from "./Header";
import IslandCard from "./IslandCard";

const islands = [
     {
        id: 1,
        name: "Maui",
        description: "Known as the Valley Isle, famous for Road to Hana and Haleakala.",
        tip: "Visit Haleakala crater at sunrise - arrive 30 min early.",
    },
    {
        id: 2,
        name: "Oahu",
        description: "Home to Honolulu, Waikiki Beach, and Pearl Harbor.",
        tip: "Take TheBus - it covers the entire island and is very affordable.",
    },
    {
        id: 3,
        name: "Kauai",
        description: "The Garden Isle, renowned for Na Pali Coast and Waimea Canyon.",
        tip: "Rent a kayak to reach Honopu Beach - no other access is permitted.",
    }
];

//manually altered to apply to the new structure of islands array and import the header component.
function App() {
    return (
    <div>
        <Header />  
        {islands.map(island => (
            <IslandCard key={island.id} {...island} />
            ))}
    </div>
    );
}

export default App;
