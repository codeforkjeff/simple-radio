import React from 'react';
import { PlayCircleFill, StopCircleFill, SkipForwardFill, SkipBackwardFill } from 'react-bootstrap-icons';
import './StreamPlayerControls.css';

function StreamPlayerControls({ playerState: {streams, currentStreamIndex, isPlaying }, dispatchPlayer }) {
    console.log("rendering StreamPlayerControls")

    console.log(`isPlaying=${isPlaying}`)

    const pause = () => dispatchPlayer({ type: 'stop'})

    const play = () => dispatchPlayer({ type: 'play'})

    const skipBackward = () => dispatchPlayer({ type: 'skip_backward' })

    const skipForward = () => dispatchPlayer({ type: 'skip_forward' })

    const canSkipBackward = () => currentStreamIndex !== 0

    const canSkipForward = () => currentStreamIndex !== streams.length - 1

    return (
      <div className="d-flex justify-content-center align-items-center player-controls">

        <div className={`${canSkipBackward() ? 'click-enabled' : 'click-disabled'}`}><SkipBackwardFill size={60} onClick={skipBackward}/></div>

        <div className="play-icon-container click-enabled">
        { isPlaying ? (
            <StopCircleFill onClick={pause} size="80"></StopCircleFill>
        ) : (
            <PlayCircleFill onClick={play} size="80"></PlayCircleFill>
        )}
        </div>

        <div className={`${canSkipForward() ? 'click-enabled' : 'click-disabled'}`}><SkipForwardFill size={60} onClick={skipForward}/></div>

      </div>
    )
  }

  export default StreamPlayerControls;
