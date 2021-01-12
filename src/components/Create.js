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
// import { useAuth } from "../context/AuthContext";
import { useMainContext } from "../context/MainContext";
import UploadImage from "./UploadImage";
import "../App.css";

const Create = () => {
  const [loaded, setLoaded] = useState(false);
  const [falseyPics, setFalsey] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const { user, allPicsInDb, allAlbums } = useMainContext();
  const [file, setFile] = useState(false);
  const [code, setCode] = useState("");
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

  const createAlbum = async (e) => {
    e.preventDefault();
    const truthy = allPicsInDb.filter((pic) => pic.selected === true);
    const urls = truthy.map((pic) => pic.url);
    //const albums = {...allAlbums};
    let ranNum;
    ranNum = Math.floor(Math.random() * 10000000);
    await db
      .collection("albums")
      .doc(`${albumName.toLowerCase()}`)
      .set({
        title: albumName.toLowerCase(),
        cust_approved: false,
        url: Math.floor(Math.random() * 200).toString(),
        photo_urls: [...urls],
        code: ranNum,
      })
      .then(function () {
        console.log("Document successfully written!");
        setLoaded(false);
        setCode(ranNum);
        setTimeout(() => {
          navigate("/albums");
        }, 5000);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
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
            <Form className="mx-auto form px-5 py-5" onSubmit={createAlbum}>
              <Form.Group>
                <Form.Label>
                  <h2>CREATE YOUR ALBUM</h2>
                </Form.Label>
                <Form.Control
                  className="my-3"
                  type="text"
                  placeholder="Set an album name"
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
          <h2>Album succesfully created!</h2>
          <p>
            The album code for your customer is <strong>{code}</strong>
          </p>
          <p>You´ll be soon redirected to your albums, please wait ...</p>
        </Alert>
      )}
    </>
  );
};

export default Create;
