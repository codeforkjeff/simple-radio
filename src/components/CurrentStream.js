import React, { Fragment, useRef, useState } from 'react';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import EditStreamModal from './EditStreamModal';
import './CurrentStream.css';

function CurrentStream({ playerState: { streams, currentStreamIndex }, dispatchPlayer }) {
  console.log("rendering CurrentStream")

  const currentStream = streams[currentStreamIndex]

  const removeStream = () => {
    dispatchPlayer({ type: 'remove_stream', stream_index: currentStreamIndex })
  }
  
  const [showEditStreamModal, setShowEditStreamModal] = useState(false);

  const handleEditClick = () => {
    setShowEditStreamModal(true)
  }

  return (
    <>
    { currentStream ? (
      <div className="current-stream">
        <div className="float-end">
          <span className="edit-button-container click-enabled"><PencilSquare size="25" onClick={handleEditClick}></PencilSquare></span>
          <span className="click-enabled"><TrashFill size="25" onClick={removeStream}></TrashFill></span>
        </div>

        <h2>{ currentStream.homepage ? (
          <a href={currentStream.homepage} target="_blank">{currentStream.name}</a>
        ) : (
          <span>{currentStream.name}</span>
        )}</h2>
        <h3>{currentStream.description ? currentStream.description : (<Fragment>&nbsp;</Fragment>)}</h3>
        <EditStreamModal
          show={showEditStreamModal}
          setShow={setShowEditStreamModal}
          stream={currentStream}
          streamIndex={currentStreamIndex}
          numStreams={streams.length}
          dispatchPlayer={dispatchPlayer}
        />

      </div>
    ) : (
      <div></div>
    )}
    </>
    )
}

export default CurrentStream;
