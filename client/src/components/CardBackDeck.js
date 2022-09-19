import React from 'react'

const CardBackDeck = ({deck, display, presentation}) => {
    return (
      <div className={display}>
        {
          deck.map((item, i) => (
            <img
              key={i}
              className={presentation}
              src={require(`../assets/card-back.png`).default}
              />
          ))
        }
      </div>
    )
}

export default CardBackDeck
