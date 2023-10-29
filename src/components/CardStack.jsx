import React, { Component, createRef } from 'react';
import styled from 'styled-components';

import unlocked from '../assets/icons/check-icon.png';
import locked from '../assets/icons/x-icon.png';
import deckBlue from '../assets/Cards/deck/deck-blue.png';
import deckRed from '../assets/Cards/deck/deck-red.png';
import Card from './Card';

const CardStackStyle = styled.div.attrs(({ x, y, z, width, height, size }) => ({
  style: {
    // attributes that will update frequently passed in here
    transform: `translate(${x}px, ${y}px)`,
    zIndex: z,
    width: `${width * size}px`,
    height: `${height * size}px`,
  },
}))`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 7px dashed #80c0c0;
  border-radius: 8px;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  img {
    scale: ${({ size }) => size};
    // scaling with pixelated rendering causes weird image distortion
    /* image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
    -ms-interpolation-mode: nearest-neighbor;
    image-rendering: pixelated; */
  }

  #lock {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 90%;
    left: 90%;
    width: 25px;
    height: 25px;

    border-radius: 25px;
    background-color: ${({ color }) => color};
  }
`;

class CardStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props?.type || null,

      // contents of the deck
      contents: ['C02', 'C04', 'S14'],
      // used for creating new instances of cards and pushing them to the render method
      instances: [],

      width: 110,
      height: 160,
      image: null,
      scale: props.scale || 1,
      zLevel: 0,

      isLocked: false,
      isDragging: false,
      currentX: props.initialX || 0,
      currentY: props.initialY || 0,
    };

    this.cardRef = createRef();
  }

  componentDidMount() {
    if (this.state.type === 'deck' && !this.state.image) {
      this.setState({ image: deckBlue });
    }
  }

  drawCardFromDeck() {
    const currentCard = this.state.contents.pop();

    const newInstance = (
      <Card
        key={currentCard + this.state.contents.length}
        id={currentCard}
        initialX={this.state.currentX}
        initialY={this.state.currentY}
        scale={this.state.scale}
      />
    );

    this.setState(prev => {
      return {
        instances: [...prev.instances, newInstance],
      };
    });
  }

  handleToggleLock = () => {
    this.setState({ isLocked: !this.state.isLocked });
  };

  handleMouseDown = e => {
    e.preventDefault();

    // disable dragging, spawn card when true and type is deck
    if (this.state.isLocked) {
      if (this.state.type !== 'deck') return;

      this.drawCardFromDeck();
      return;
    }

    const cardRect = this.cardRef.current.getBoundingClientRect();

    this.setState({
      isDragging: true,
      offsetX: Math.round(e.clientX - cardRect.left),
      offsetY: Math.round(e.clientY - cardRect.top),
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = e => {
    const { isDragging, offsetX, offsetY } = this.state;

    if (isDragging) {
      const newX = Math.round(e.clientX - offsetX);
      const newY = Math.round(e.clientY - offsetY);

      this.setState({ currentX: newX, currentY: newY });
    }
  };

  handleMouseUp = () => {
    this.setState({
      isDragging: false,
    });

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  render() {
    return (
      <>
        <CardStackStyle
          ref={this.cardRef}
          width={this.state.width}
          height={this.state.height}
          size={this.state.scale}
          x={this.state.currentX}
          y={this.state.currentY}
          z={this.state.zLevel}
          color={this.state.isLocked ? '#80c0c0' : 'green'}
          onMouseDown={this.handleMouseDown}
        >
          <img src={this.state.image} />
          <div id="lock" onClick={this.handleToggleLock} />
        </CardStackStyle>
        {this.state.instances}
      </>
    );
  }
}

export default CardStack;
