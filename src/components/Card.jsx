import React from 'react'

const Card = ({ name, email, id }) => {
    return (
        <>
            <div className='tc black bg-light-green dib br3 pa2 ma2 grow bw2 shadow-5'>
                <img className='center' src={`https://robohash.org/${id}?200x200`} alt='Card image' />
                <div>
                    <h2>{name}</h2>
                    <p>{email}</p>
                </div>
            </div>
        </>
    )
}

export default Card