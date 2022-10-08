import React, { Fragment } from 'react';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';

function CurrentStream({ playerState: { streams, currentStreamIndex } }) {
  console.log("rendering CurrentStream")

  const currentStream = streams[currentStreamIndex]

  return (
    <>
    { currentStream ? (
      <div style={{padding: '1em', backgroundColor: "lightgray" }}>
        <div className="float-end">
          <span style={{paddingRight: "1em"}}><PencilSquare size="25"></PencilSquare></span>
          <TrashFill size="25"></TrashFill>
        </div>

        <h2>{ currentStream.homepage ? (
          <a href={currentStream.homepage} target="_blank">{currentStream.name}</a>
        ) : (
          <span>{currentStream.name}</span>
        )}</h2>
        <h3>{currentStream.description ? currentStream.description : (<Fragment>&nbsp;</Fragment>)}</h3>

      </div>
    ) : (
      <div></div>
    )}
    </>
    )
}

export default CurrentStream;
