import React, { Component, createRef } from 'react';
import styled from 'styled-components';

const DraggableStyle = styled.div.attrs(({ x, y, z, width, height, size }) => ({
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
`;

class DraggableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: props.scale || 1,
      zLevel: props.zLevel || 0,

      isDragging: false,
      currentX: props.initialX || 0,
      currentY: props.initialY || 0,
      width: props.width,
      height: props.height,
    };

    this.divRef = createRef();
  }

  handleMouseDown = e => {
    e.preventDefault();
    const cardRect = this.divRef.current.getBoundingClientRect();

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
      <DraggableStyle
        ref={this.divRef}
        width={this.state.width}
        height={this.state.height}
        size={this.state.scale}
        x={this.state.currentX}
        y={this.state.currentY}
        z={this.state.zLevel}
        onMouseDown={this.handleMouseDown}
      >
        {this.props.children}
      </DraggableStyle>
    );
  }
}

export default DraggableComponent;
