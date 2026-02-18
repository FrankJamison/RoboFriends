import React from 'react';
import Card from './Card.jsx'

const CardList = ({ robots }) => {
    const cardComponent = robots.map((user) => {
        return (
            <Card
                key={user.id}
                name={user.name}
                email={user.email}
                id={user.id}
            />
        );
    });
    return (
        <div className="App">
            {cardComponent}
        </div>
    );
};

export default CardList;