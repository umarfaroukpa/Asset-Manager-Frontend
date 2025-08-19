declare module 'react-confetti' {
  import { Component } from 'react';
  
  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    gravity?: number;
    wind?: number;
    colors?: string[];
    opacity?: number;
    recycle?: boolean;
    run?: boolean;
  }
  
  export default class Confetti extends Component<ConfettiProps> {}
}