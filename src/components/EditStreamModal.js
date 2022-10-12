import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import EditStream from './EditStream';


function EditStreamModal({ show, setShow, stream, streamIndex, dispatchPlayer }) {

  const handleClose = () => setShow(false)

  const saveStream = (result) => {
    dispatchPlayer({ type: 'edit_stream', stream_index: streamIndex, stream: result })
    setShow(false)
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Edit Stream</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md="12">
              <EditStream
                stream={stream}
                saveStream={saveStream}
                cancel={handleClose}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  )
}

export default EditStreamModal
