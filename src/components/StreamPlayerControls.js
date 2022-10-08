import React, { useEffect } from 'react';
import { PlayCircleFill, StopCircleFill, SkipForwardFill, SkipBackwardFill } from 'react-bootstrap-icons';
import './StreamPlayerControls.css';

function StreamPlayerControls({ playerState: {streams, currentStreamIndex, isPlaying }, dispatchPlayer }) {
    console.log("rendering StreamPlayerControls")

    const visible = currentStreamIndex !== null

    console.log(`isPlaying=${isPlaying}`)

    const pause = () => dispatchPlayer({ type: 'stop'})
  
    const play = () => dispatchPlayer({ type: 'play'})
  
    const skipBackward = () => dispatchPlayer({ type: 'skip_backward' })
  
    const skipForward = () => dispatchPlayer({ type: 'skip_forward' })
  
    return (
      <div className={!visible ? "d-none" : ""}>
        <div className="d-flex justify-content-center align-items-center player-controls">
            
            <div className="backward-icon-container"><SkipBackwardFill size={60} onClick={skipBackward}/></div>

            <div className="play-icon-container">
            { isPlaying ? (
                <StopCircleFill onClick={pause} size="80"></StopCircleFill>
            ) : (
                <PlayCircleFill onClick={play} size="80"></PlayCircleFill>
            )}
            </div>

            <div className="forward-icon-container"><SkipForwardFill size={60} onClick={skipForward}/></div>
            
        </div>
      </div>
    )
  }
  
  export default StreamPlayerControls;
