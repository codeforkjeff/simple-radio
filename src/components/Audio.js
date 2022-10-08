import React, { useEffect } from 'react';

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
