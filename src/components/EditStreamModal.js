import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import EditStream from './EditStream';


function EditStreamModal({ show, setShow, stream, streamIndex, numStreams, dispatchPlayer }) {

  const handleClose = () => setShow(false)

  const saveStream = (result, position) => {
    dispatchPlayer({ type: 'edit_stream', streamIndex: streamIndex, position: position, stream: result })
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
                streamIndex={streamIndex}
                numStreams={numStreams}
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
