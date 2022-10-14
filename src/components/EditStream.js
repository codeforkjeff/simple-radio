import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function EditStream({ stream, streamIndex, numStreams, addStream, saveStream, cancel }) {

  const [ streamCopy, setStreamCopy ] = useState(stream)

  const [ position, setPosition ] = useState(streamIndex)

  const updateStreamField = (e) => {
    setStreamCopy({
      ...streamCopy,
      ...{
        [e.target.name]: e.target.value
      }
    })
  }

  // add 1 so you can add something to very end
  const maxPosition = numStreams + 1

  return (
    <Container>
    <Form>
      <Form.Group className="md-12 mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" placeholder="e.g. WNYC" value={streamCopy['name']} onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="desc">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" placeholder="longer description goes here" value={streamCopy['description']} onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="formurl">
        <Form.Label>Stream URL</Form.Label>
        <Form.Control type="text" name="url" placeholder="audio stream url" value={streamCopy['url']} onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="homepage">
        <Form.Label>Homepage URL</Form.Label>
        <Form.Control type="text" name="homepage" value={streamCopy['homepage']} placeholder="e.g. https://www.wync.org"onChange={updateStreamField}/>
      </Form.Group>

      <Form.Group className="md-12 mb-3" controlId="position">
        <Form.Label>Position</Form.Label>
        <Form.Select name="position" onChange={(e) => setPosition(e.target.value)} defaultValue={streamIndex}>
          {[...Array(maxPosition).keys()].map((i) => {
            return (
              <option key={i} value={i}>{i+1}</option>
            )
          })}
        </Form.Select>
      </Form.Group>

      { addStream && (
        <Button onClick={() => addStream(streamCopy, parseInt(position))}>Add</Button>
      )}
      { saveStream && (
        <Button onClick={() => saveStream(streamCopy, parseInt(position))}>Save</Button>
      )}
      { cancel && (
        <Button onClick={cancel}>Cancel</Button>
      )}
    </Form>
    </Container>
  )
}

export default EditStream
