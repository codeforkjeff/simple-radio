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


function AddStreamModal({ show, setShow, playerState: { streams }, dispatchPlayer }) {

  const [ searchText, setSearchText ] = useState("")

  const [ streamsDbLoadState, setStreamsDbLoadState ] = useState("not_loaded")

  const [ streamsDb, setStreamsDb ] = useState([])

  const [ searchResults, setSearchResults ] = useState([])

  const handleClose = () => setShow(false)

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    if(show && streamsDbLoadState !== "loaded") {
      setStreamsDbLoadState("loading")
      console.log("loading database")
      fetch(`/stations_reduced.json?${Date.now()}`)
        .then(res => res.json())
        .then((result) => {
          console.log("got result")
          setStreamsDb(result)
          setStreamsDbLoadState("loaded")
        })
        .catch((error) => {
          alert("Error loading stations data: " + error)
        })
    }
  }, [show])

  const search = (e) => {
    e.preventDefault()
    const needle = searchText.toUpperCase()
    const results = streamsDb.filter((streamRecord) => streamRecord.name.toUpperCase().indexOf(needle) !== -1)
    setSearchResults(results)
  }

  const addStream = (result, position) => {
    dispatchPlayer({ type: 'add_stream', stream: result, position: position })
    setShow(false)
  }

  const formatResult = (result) => {
    return (
      <span>{result.name} ({result.countrycode})</span>
    )
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add a Stream</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Tabs
        defaultActiveKey="search"
        id="add-stream-tabs"
        className="mb-3"
      >
        <Tab eventKey="search" title="Search">
          { streamsDbLoadState === "loading" && (
            <p>Loading list of stations, hang on ...</p>
          )}
          { streamsDbLoadState === "loaded" && (
            <>
            <Container>
              <Row>
                <Col md="12">
                <Form onSubmit={search}>
                  <Form.Group className="md-3" controlId="formBasicEmail">
                    <Form.Control type="text" onChange={(e) => handleSearchTextChange(e)}/>
                  </Form.Group>
                </Form>
                </Col>
              </Row>
              {searchResults.map((result, index) => (
                <Row key={index}>
                  <Col md="12">
                    <Button variant="link" onClick={() => addStream(result, streams.length)}>{formatResult(result)}</Button>
                  </Col>
                </Row>
              ))}
            </Container>
            </>
          )}
        </Tab>
        <Tab eventKey="custom" title="Custom">
          <EditStream
            stream={{}}
            numStreams={streams.length}
            addStream={addStream}
          />
        </Tab>
      </Tabs>
      </Modal.Body>
    </Modal>
  )
}

export default AddStreamModal
