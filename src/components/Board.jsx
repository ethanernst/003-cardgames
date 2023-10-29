import React, { Component } from 'react';
import styled from 'styled-components';

import Card from './Card';
import CardStack from './CardStack';

const BoardStyle = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #008080;
`;

class Board extends Component {
  constructor(props) {
    super(props);
  }

  generateDeck() {
    // prettier-ignore
    // Card ranks (2-10, Jack, Queen, King, Ace)
    const ranks = ['02','03','04','05','06','07','08','09','10','11','12','13','14',];
    const suits = ['C', 'D', 'H', 'S']; // Card suits (Clubs, Diamonds, Hearts, Spades)

    const deck = [];

    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push(suit + rank);
      }
    }

    return deck;
  }

  renderCards(cards) {
    const renderedJsx = [];

    const xSpacing = 120;
    const ySpacing = 200;
    const scale = 1;
    const rows = 4;
    const columns = 13;

    for (let row = 0; row < rows; row++) {
      const counter = row * columns;
      for (let column = 0; column < columns; column++) {
        renderedJsx.push(
          <Card
            key={cards[column + counter]}
            id={cards[column + counter]}
            initialX={column * xSpacing}
            initialY={row * ySpacing}
            scale={scale}
          />
        );
      }
    }

    return renderedJsx;
  }

  render() {
    const cardDeck = this.generateDeck();

    return (
      <BoardStyle>
        {this.renderCards(cardDeck)}
        <CardStack type={'deck'} initialX={200} initialY={800}></CardStack>
      </BoardStyle>
    );
  }
}

export default Board;
