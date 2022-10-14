import { useEffect, useRef } from 'react';

const KeyPressListener = ({ playerState: { streams, currentStreamIndex }, dispatchPlayer }) => {

  useEffect(() => {
    const listener = (e) => {
      if(e.target.tagName !== 'INPUT') {
        if("123456789".indexOf(e.key) !== -1) {
          const index = parseInt(e.key) - 1
          if(index < streams.length) {
            dispatchPlayer({ type: "play_stream", currentStreamIndex: index })
          }
        }
        else if (e.key === 'ArrowRight') {
          dispatchPlayer({ type: "skip_forward" })
        }
        else if (e.key === 'ArrowLeft') {
          dispatchPlayer({ type: "skip_backward" })
        }
      }
    }
    window.addEventListener('keydown', listener)
    return () => {
      window.removeEventListener('keydown', listener)
    }
  })
}

export default KeyPressListener;

