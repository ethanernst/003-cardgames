import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import DraggableComponent from './DraggableComponent';

const DraggableCardStyle = styled.div.attrs(
  ({ x, y, z, width, height, size }) => ({
    style: {
      // attributes that will update frequently passed in here
      transform: `translate(${x}px, ${y}px)`,
      zIndex: z,
      width: `${width * size}px`,
      height: `${height * size}px`,
    },
  })
)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

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
`;

class DraggableCard extends DraggableComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      suit: props.id.slice(0, 1),
      number: props.id.slice(1),

      image: null,
    };

    this.divRef = createRef();
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.loadImage();
    }
  }

  loadImage() {
    const { id } = this.state;

    import(`../assets/Cards/${id}.png`)
      .then(module => {
        this.setState({ image: module.default });
      })
      .catch(error => {
        console.error(`Error loading image: ${error}`);
      });
  }

  render() {
    return (
      <div onMouseDown={this.props.handleMouseDown}>
        {super.render()}
        <img src={this.state.image} />
      </div>
    );
  }
}

export default DraggableCard;
