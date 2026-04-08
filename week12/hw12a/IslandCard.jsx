import React from "react";

//manually altered, AI-assisted for the initial structuring of the component. I needed assistance understanding what was required for the ({name, description, tip}) => { ... } syntax. Styling manually coded.
// receives island data from App.jsx and displays it in a card format. ID not needed for this component as it doesn't need to be displayed for users. 
function IslandCard({ name, description, tip }) {
    const customStyle = {
        color: 'green'
    };
    return (
        <div>
            <h2 style={customStyle}>{name}</h2>
            <p>{description}</p>
            <p>Visitor Tip: {tip}</p>
        </div>
    );

}

export default IslandCard;
