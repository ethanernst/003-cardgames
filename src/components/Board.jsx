import React, { Component } from 'react';
import styled from 'styled-components';

import Card from './Card';

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
    const ranks = [
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
    ]; // Card ranks (2-10, Jack, Queen, King, Ace)
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
    const ySpacing = 150;
    for (let i = 0; i < 4; i++) {
      const counter = i * 13;
      for (let j = 0; j < 13; j++) {
        renderedJsx.push(
          <Card
            key={cards[j + counter]}
            id={cards[j + counter]}
            initialX={j * xSpacing}
            initialY={i * ySpacing}
          />
        );
      }
    }

    console.log(renderedJsx);

    return renderedJsx;
  }

  render() {
    const cardDeck = this.generateDeck();
    console.log(cardDeck);

    return <BoardStyle>{this.renderCards(cardDeck)}</BoardStyle>;
  }
}

export default Board;
