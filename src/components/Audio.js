import React, { useEffect, useRef, useState } from 'react';

/*
This should get rendered on initial page load, so that browser doesn't restrict
playing audio. See "user interaction" restrictions:

https://stackoverflow.com/questions/57504122/browser-denying-javascript-play

React's render won't re-create the audio element as long as there's no state
attached to it.
*/
const Audio = ({ playerState }) => {
  const { currentStreamIndex, streams, isPlaying } = playerState

  const currentStream = streams[currentStreamIndex]

  // reflects the state of the Audio element: is it playing? (vs is it supposed to be playing).
  // only listeners on audio element should ever change this.
  const [ audioPlaying, setAudioPlaying ] = useState(false)

  useEffect(() => {
    console.log(`Audio: in effect, isPlaying=${isPlaying} audioPlaying=${audioPlaying}`)

    const play = (e) => setAudioPlaying(true)
    const stop = (e) => setAudioPlaying(false)

    const player = document.getElementById('player')

    const listeners = {
      'playing': play,
      'abort': stop,
      'ended': stop,
      'pause': stop,
    }

    Object.keys(listeners).forEach((eventType) => {
      player.addEventListener(eventType, listeners[eventType])
    })

    if(isPlaying) {
      if(!audioPlaying || currentStream.url !== player.getAttribute("src")) {
        player.setAttribute("src", currentStream.url)
        player.load()
        player.play()
      }
    } else {
      player.pause()
    }

    return () => {
      Object.keys(listeners).forEach((eventType) => {
        player.removeEventListener(eventType, listeners[eventType])
      }  )
    }
  })

  return (
    <audio id="player">
      <source id="audio-source"/>
    </audio>
  )
}

export default Audio
