import React from 'react';
import styled from 'styled-components';

import fabricTexture from '../assets/fabricTexture.jpg';

const BoardStyle = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${fabricTexture});
  background-size: cover;
`;

class Board extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <BoardStyle></BoardStyle>;
  }
}

export default Board;
