import React, { useEffect } from 'react';

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

  useEffect(() => {
    console.log("in effect, isPlaying=" + isPlaying)
    const player = document.getElementById('player');
    if(isPlaying) {
      player.setAttribute("src", currentStream.url)
      player.load()
      player.play()
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
