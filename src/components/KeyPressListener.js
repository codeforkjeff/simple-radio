import { useEffect, useRef } from 'react';

const KeyPressListener = ({ playerState: { streams, currentStreamIndex }, dispatchPlayer }) => {

  // ensures that useEffect below runs only once even in strict mode
  const runOnce = useRef(false)

  useEffect(() => {
    if(!runOnce.current) {
      console.log("adding keypress listener")
      window.addEventListener('keydown', e => {
        console.log(e.key)
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
      })
    }
    runOnce.current = true
  })
}

export default KeyPressListener;

