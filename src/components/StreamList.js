import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { PlusSquareFill } from 'react-bootstrap-icons';


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
  
function StreamList({ playerState: { streams }, dispatchPlayer }) {
  console.log("rendering StreamList")
  return (
    <Container>
    <Row>
      <Col md="10">
        <h3>Streams</h3>
      </Col>
      <Col className="d-flex justify-content-end align-items-center">
          <PlusSquareFill size="25"></PlusSquareFill>
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
    </Container>
  )
}
  
export default StreamList;
