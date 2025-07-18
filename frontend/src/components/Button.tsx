import React from 'react';
import styled from 'styled-components';

// 1. Interface updated with buttonWidth and buttonHeight
interface ButtonProps {
  buttonText?: string;
  buttonColor?: string;
  circleColor?: string;
  circleSize?: string;
  buttonWidth?: string;  // New prop for button width
  buttonHeight?: string; // New prop for button height
}

// 2. Component updated with new props and default values
const Button: React.FC<ButtonProps> = ({
  buttonText = 'Submit',
  buttonColor = '#171717',
  circleColor = '#0c66ed',
  circleSize = '30px',
  buttonWidth = 'auto',
  buttonHeight = 'auto'
}) => {
  return (
    <StyledWrapper
      buttonColor={buttonColor}
      circleColor={circleColor}
      circleSize={circleSize}
      buttonWidth={buttonWidth}
      buttonHeight={buttonHeight}
    >
      <button>
        <span className="circle1" />
        <span className="circle2" />
        <span className="circle3" />
        <span className="circle4" />
        <span className="circle5" />
        <span className="text">{buttonText}</span>
      </button>
    </StyledWrapper>
  );
}

// 3. Styled-component updated to use the new props
const StyledWrapper = styled.div<ButtonProps>`
  button {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: white;
    background-color: ${props => props.buttonColor};
    padding: 1em 2em;
    border: none;
    border-radius: .6rem;
    position: relative;
    cursor: pointer;
    overflow: hidden;

    /* Apply dynamic width and height */
    width: ${props => props.buttonWidth};
    height: ${props => props.buttonHeight};

    /* Added for better text centering when height is set */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button span:not(:nth-child(6)) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: ${props => props.circleSize};
    width: ${props => props.circleSize};
    background-color: ${props => props.circleColor};
    border-radius: 50%;
    transition: .6s ease;
  }

  button span:nth-child(6) {
    position: relative;
  }

  button span:nth-child(1) {
    transform: translate(-3.3em, -4em);
  }

  button span:nth-child(2) {
    transform: translate(-6em, 1.3em);
  }

  button span:nth-child(3) {
    transform: translate(-.2em, 1.8em);
  }

  button span:nth-child(4) {
    transform: translate(3.5em, 1.4em);
  }

  button span:nth-child(5) {
    transform: translate(3.5em, -3.8em);
  }

  button:hover span:not(:nth-child(6)) {
    transform: translate(-50%, -50%) scale(4);
    transition: 1.5s ease;
  }
`;

export default Button;