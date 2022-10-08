import React, { useEffect } from 'react';
import { PlayCircleFill, PauseCircleFill, SkipForwardFill, SkipBackwardFill } from 'react-bootstrap-icons';
import './StreamPlayerControls.css';

function StreamPlayerControls({ playerState: {streams, currentStreamIndex, isPlaying }, dispatchPlayer }) {
    console.log("rendering StreamPlayerControls")

    const visible = currentStreamIndex !== null

    const currentStream = streams[currentStreamIndex]

    console.log(`isPlaying=${isPlaying}`)

    const pause = () => {
      dispatchPlayer({ type: 'stop'})
    }
  
    const play = () => {
      dispatchPlayer({ type: 'play'})
    }
  
    const skipBackward = () => dispatchPlayer({ type: 'skip_backward' })
  
    const skipForward = () => dispatchPlayer({ type: 'skip_forward' })
  
    useEffect(() => {
      console.log("in effect, isPlaying=" + isPlaying)
      if(visible) {
        const player = document.getElementById('player');
        if(isPlaying) {
          player.setAttribute("src", currentStream.url)
          player.load()
          player.play()
        } else {
          player.pause()
        }
      }
    })
    
    /*
    React's render doesn't re-create the audio element, as long as there's no state attached to it.
    The visibility logic here ensures audio gets rendered on initial page load, which is important
    to get past browser restrictions on playing audio unless there's "user interaction"

    https://stackoverflow.com/questions/57504122/browser-denying-javascript-play
    */
    return (
      <div className={!visible ? "d-none" : ""}>
        <div className="d-flex justify-content-center align-items-center player-controls">
            
            <div className="backward-icon-container"><SkipBackwardFill size={60} onClick={skipBackward}/></div>

            <div className="play-icon-container">
            { isPlaying ? (
                <PauseCircleFill onClick={pause} size="80"></PauseCircleFill>
            ) : (
                <PlayCircleFill onClick={play} size="80"></PlayCircleFill>
            )}
            </div>

            <div className="forward-icon-container"><SkipForwardFill size={60} onClick={skipForward}/></div>
            
        </div>
        <audio id="player">
          <source id="audio-source"/>
        </audio>
      </div>
    )
  }
  
  export default StreamPlayerControls;
