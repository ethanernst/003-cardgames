import React, { Component, createRef } from 'react';
import styled from 'styled-components';

const CardStyle = styled.div.attrs(props => ({
  style: {
    transform: `translate(${props?.x || 0}px, ${props?.y || 0}px)`, // Pass x and y as props to the styled component
  },
}))`
  position: absolute;
  width: ${({ size }) => 88 * size}px;
  height: ${({ size }) => 124 * size}px;
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
  }
`;

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      suit: props.id.slice(0, 1),
      number: props.id.slice(1),

      image: null,
      scale: props?.scale || 1,

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
      offsetX: e.clientX - cardRect.left,
      offsetY: e.clientY - cardRect.top,
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = e => {
    const { isDragging, offsetX, offsetY } = this.state;

    if (isDragging) {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

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
      <CardStyle
        ref={this.cardRef}
        size={this.state.scale}
        x={this.state.currentX}
        y={this.state.currentY}
        onMouseDown={this.handleMouseDown}
      >
        <img src={this.state.image} />
      </CardStyle>
    );
  }
}

export default Card;
