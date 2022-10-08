import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { PlusSquareFill } from 'react-bootstrap-icons';
import AddStreamModal from './AddStreamModal.js';
import './StreamList.css';


function BlockButton({ index, dispatchPlayer, children}) {

  const handleClick = () => {
    dispatchPlayer({ type: 'play_stream', currentStreamIndex: index })
  }
  
  return (
    <div className="d-grid gap-2" style={{"marginTop": "0.5em", "marginBottom": "0.5em"}}>
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
    <Container>
    <Row>
      <Col md="10">
        <h3>Streams</h3>
      </Col>
      <Col className="d-flex justify-content-end align-items-center">
          <div className="add-stream-icon-container"><PlusSquareFill size="25" onClick={handleShow}></PlusSquareFill></div>
      </Col>
    </Row>
      {
        streams.map((stream, i) => {
          return (
            <Row key={i}>
              <Col md="1" className="d-flex align-items-center">{ i < 10 ? `${i+1}.` : ""}</Col>
              <Col md="11">
              <BlockButton 
                index={i}
                dispatchPlayer={dispatchPlayer}>{stream.name}</BlockButton>
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
