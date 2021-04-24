import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  //   Card,
  //   Media,
} from "react-bootstrap";
// import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import "../App.css";

const EditTitle = () => {
  const { currentAlbum, user } = useMainContext();
  const [title, setTitle] = useState("");
  //   const [code, setCode] = useState("");
  //   const navigate = useNavigate();

  const updateAlbum = (e) => {
    e.preventDefault();
    alert(title);
  };

  return (
    <div>
      <Container>
        <h2 className="my-4">
          Update your album: {currentAlbum.title.toUpperCase()}
        </h2>
        <Form className="mx-auto form px-5 py-5" onSubmit={updateAlbum}>
          <Form.Group>
            <Form.Label>Enter your new title</Form.Label>
            <Form.Control
              id="album-title"
              type="text"
              placeholder={currentAlbum.title}
              className="my-5 w-50 mx-auto"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button className="mt-0" variant="primary" type="submit">
              Update title
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
};

export default EditTitle;
