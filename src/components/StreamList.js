import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { PlusSquareFill } from 'react-bootstrap-icons';
import AddStreamModal from './AddStreamModal.js';
import SaveButton from './SaveButton'
import './StreamList.css';

function StreamButton({ index, dispatchPlayer, children}) {

  const handleClick = () => {
    dispatchPlayer({ type: 'play_stream', currentStreamIndex: index })
  }
  
  return (
    <div className="d-grid gap-2 button-container">
      <Button size="lg"
        onClick={handleClick}>{children}</Button>
    </div>
    );
}
  
function StreamList(props) {
  const { playerState } = props
  const { playerState: { streams }, dispatchPlayer } = props

  console.log("rendering StreamList")

  const [showAddStreamModal, setShowAddStreamModal] = useState(false);

  const handleShow = () => setShowAddStreamModal(true);

  return (
    <Container className="overflow-auto stream-list-container">
    <Row>
      <Col>
        <div className="float-end">
            <span className="save-button-container click-warning-enabled"><SaveButton
              playerState={playerState}
              dispatchPlayer={dispatchPlayer}
            /></span>
            <span className="click-enabled"><PlusSquareFill size="25" onClick={handleShow}></PlusSquareFill></span>
        </div>
        <h3>Streams</h3>
      </Col>
    </Row>
      {
        streams.map((stream, i) => {
          return (
            <Row key={i}>
              <Col md="1" className="d-flex d-none d-lg-inline-flex align-items-center">{ i < 9 ? `${i+1}.` : ""}</Col>
              <Col md="11">
              <StreamButton
                index={i}
                dispatchPlayer={dispatchPlayer}>{stream.name}</StreamButton>
              </Col>
            </Row>
          )
        })
      }
    <AddStreamModal
      show={showAddStreamModal}
      setShow={setShowAddStreamModal}
      playerState={playerState}
      dispatchPlayer={dispatchPlayer}
    />
    </Container>
  )
}
  
export default StreamList;
