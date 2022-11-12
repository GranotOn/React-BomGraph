import React from "react";
import BomGraph from "./BomGraph/index";
import styled from "styled-components";
import GlobalStyle from "./globalStyle";

const StyledGraphContainer = styled.div`
  height: 800px;
  width: 1200px;

  margin: auto;
  margin-top: 10vh;
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <StyledGraphContainer>
        <BomGraph />
      </StyledGraphContainer>
    </>
  );
};

export default App;
