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

  // is audio actually playing (vs supposed to be playing).
  // only listeners on audio element should ever change this.
  const [ audioPlaying, setAudioPlaying ] = useState(false)

  // ensures that useEffect below runs only once even in strict mode
  const runOnce = useRef(false)

  useEffect(() => {
    console.log("in effect, isPlaying=" + isPlaying)

    const player = document.getElementById('player')

    if(!runOnce.current) {
      console.log("adding listeners to audio element")
      player.addEventListener('playing', (event) => {
        setAudioPlaying(true)
      })
      player.addEventListener('abort', (event) => {
        setAudioPlaying(false)
      })
      player.addEventListener('ended', (event) => {
        setAudioPlaying(false)
      })
      runOnce.current = true
    }

    if(isPlaying) {
      if(!audioPlaying || currentStream.url !== player.getAttribute("src")) {
        player.setAttribute("src", currentStream.url)
        player.load()
        player.play()
      }
    } else {
      player.pause()
    }
  })

  return (
    <audio id="player">
      <source id="audio-source"/>
    </audio>
  )
}

export default Audio
