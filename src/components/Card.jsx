import React, { Component, createRef } from 'react';
import styled from 'styled-components';

const CardStyle = styled.div.attrs(({ x, y, z, width, height, size }) => ({
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

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      suit: props.id.slice(0, 1),
      number: props.id.slice(1),

      width: 88,
      height: 124,
      image: null,
      scale: props.scale || 1,
      zLevel: 0,

      isDragging: false,
      currentX: props.initialX || 0,
      currentY: props.initialY || 0,
    };

    this.cardRef = createRef();
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

  handleMouseDown = e => {
    e.preventDefault();
    const cardRect = this.cardRef.current.getBoundingClientRect();

    this.setState({
      isDragging: true,
      offsetX: Math.round(e.clientX - cardRect.left),
      offsetY: Math.round(e.clientY - cardRect.top),
      zLevel: 100,
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
      zLevel: 60,
    });

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  render() {
    return (
      <CardStyle
        ref={this.cardRef}
        width={this.state.width}
        height={this.state.height}
        size={this.state.scale}
        x={this.state.currentX}
        y={this.state.currentY}
        z={this.state.zLevel}
        onMouseDown={this.handleMouseDown}
      >
        <img src={this.state.image} />
      </CardStyle>
    );
  }
}

export default Card;
