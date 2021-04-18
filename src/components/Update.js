import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Col,
  Alert,
  Card,
  Media,
} from "react-bootstrap";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import UploadImage from "./UploadImage";
import "../App.css";

const Update = () => {
  const [loaded, setLoaded] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const {
    allPicsInDb,
    currentAlbum,
    user,
    resetPicsSelection,
  } = useMainContext();
  const [code, setCode] = useState("");
  const [file, setFile] = useState(false);
  const navigate = useNavigate();

  const setName = (e) => {
    setAlbumName(e.target.value);
  };

  const confirmFile = (message) => {
    if (message === true) {
      setFile(false);
    } else {
      setFile(true);
    }
  };

  const updateAlbum = async (e) => {
    e.preventDefault();

    const selected = allPicsInDb.filter((pic) => pic.selected === true);

    if (!selected.length) {
      alert("You need to upload or select at least 1 pic");
      return;
    } else {
      const truthy = allPicsInDb.filter((pic) => pic.selected === true);
      const urls = truthy.map((pic) => pic.url);

      if (currentAlbum.title !== albumName) {
        db.collection("albums")
          .doc(`${currentAlbum.title.toLowerCase()}`)
          .delete();
      }
      let ranNum;
      ranNum = Math.floor(Math.random() * 10000000);
      await db
        .collection("albums")
        .doc(`${albumName.toLowerCase()}`)
        .set({
          title: albumName.toLowerCase(),
          cust_apppproved: false,
          url: Math.floor(Math.random() * 200).toString(),
          photo_urls: [...urls],
          code: ranNum,
          user: user.email,
        })
        .then(function () {
          console.log("Document successfully written!");
          setLoaded(false);
          setCode(ranNum);
          setTimeout(() => {
            resetPicsSelection();
            navigate("/albums");
          }, 5000);
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  };

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      setLoaded(true);
    }
  }, [allPicsInDb]);

  return (
    <>
      {loaded && allPicsInDb && (
        <Container>
          <Col lg={10} className="my-5 pt-5 mx-auto">
            <Form className="mx-auto form px-5 py-5" onSubmit={updateAlbum}>
              <Form.Group>
                <Form.Label>
                  <h2>UPDATE YOUR ALBUM</h2>
                </Form.Label>
                <Form.Control
                  className="my-3"
                  type="text"
                  placeholder={
                    currentAlbum
                      ? currentAlbum.title.toUpperCase()
                      : "Set an album name"
                  }
                  onChange={setName}
                  required
                />
                <Col lg={12} md={10} className="d-flex">
                  {allPicsInDb &&
                    allPicsInDb.map((pic, index) => {
                      if (pic.selected === true) {
                        return (
                          <Card className="ml-3" id="media" key={index}>
                            <Media key={pic.id} className="my-auto">
                              <img
                                width="100%"
                                height="auto"
                                src={pic.url}
                                alt="Generic placeholder"
                              />
                            </Media>
                          </Card>
                        );
                      }
                    })}
                </Col>
                <UploadImage albumName={albumName} setErrorMsg={confirmFile} />
                <Button className="mt-0" variant="primary" type="submit">
                  Confirm
                </Button>
              </Form.Group>
            </Form>
            {!file && (
              <Alert variant="warning">You haven´t chosen any pics</Alert>
            )}
          </Col>
        </Container>
      )}
      {code && (
        <Alert variant="success">
          <h2>Album succesfully updated!</h2>
          <p>
            The album code for your customer is (copy this link){" "}
            <p>
              <a href={`/review/${code}`}>
                <strong>photography.catala-sverdrup.se/review/{code}</strong>
              </a>
            </p>
          </p>
          <p>You´ll be soon redirected to your albums, please wait ...</p>
        </Alert>
      )}
    </>
  );
};

export default Update;
