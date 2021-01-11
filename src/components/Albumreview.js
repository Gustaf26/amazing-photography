import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Row,
  Card,
  Media,
  Button,
  Alert,
  Col,
} from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const Albumreview = () => {
  const [picsLoaded, setLoaded] = useState(false);
  const {
    allPicsInDb,
    currentAlbum,
    allAlbums,
    albumPics,
    clientAlbum,
    setClientAlbum,
  } = useMainContext();
  const allPicsFix = useRef([]);
  const navigate = useNavigate();
  const { albumId } = useParams();
  const [alert, setAlert] = useState(false);

  const selectPic = (url, ind) => {
    let emptyArr;
    emptyArr = [];
    let fullArr;
    fullArr = [];
    fullArr = [...clientAlbum.photo_urls];

    fullArr.map((photo, index) => {
      if (photo === url) {
        if (photo.selected) {
          alert("Picture already selected");
          return;
        }
        fullArr.splice(index, 1);
        fullArr.push({ url: photo.url ? photo.url : url, selected: true });
      }
    });
    if (fullArr.length) {
      setClientAlbum((prev) => {
        return { ...prev, photo_urls: [...fullArr] };
      });
    }
  };

  const deleteSelection = (url, ind) => {
    let emptyArr;
    emptyArr = [];
    let fullArr;
    fullArr = [];
    fullArr = [...clientAlbum.photo_urls];

    fullArr.map((photo, index) => {
      if (photo === url) {
        if (!photo.selected) {
          alert("Picture already dismissed");
          return;
        }
        fullArr.splice(index, 1);
        fullArr.push({ url: photo.url, selected: false });
      }
    });
    if (fullArr.length) {
      setClientAlbum((prev) => {
        return { ...prev, photo_urls: [...fullArr] };
      });
    }
  };

  const confirmAlbum = (e) => {
    e.preventDefault();
    setLoaded(false);
    setAlert(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
    //setAllPics(allPicsFix.current);
    //navigate(`/albums/${currentAlbum.code}/update`);
  };

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      allPicsFix.current = [...allPicsInDb];

      setLoaded(true);
    }
  }, [allPicsInDb]);

  useEffect(() => {
    let emptyObj;

    emptyObj = [];
    allAlbums.map((alb) => {
      if (alb.code === Number(albumId)) {
        emptyObj = { ...alb };
      }
    });
    if (emptyObj) {
      setClientAlbum(emptyObj);

      setLoaded(true);
    }
  }, []);

  return (
    <>
      <Container>
        <Row lg={9} className="d-flex mt-5 mx-auto">
          {picsLoaded &&
            clientAlbum &&
            clientAlbum.photo_urls &&
            clientAlbum.photo_urls.map((photo, index) => {
              return (
                <Card id="media" key={index}>
                  <Media key={index} className="pic my-auto">
                    <img
                      width="100%"
                      height="auto"
                      src={photo.url ? photo.url : photo}
                      alt="Generic placeholder"
                      className={
                        photo.selected && photo.selected === true
                          ? "pic-selected"
                          : "not-selected"
                      }
                    />
                  </Media>
                  <div className="d-flex mx-auto my-2">
                    <AddCircleOutlineIcon
                      onClick={() => selectPic(photo, index)}
                      color="primary"
                    />
                    <IndeterminateCheckBoxIcon
                      onClick={() => deleteSelection(photo, index)}
                      color="secondary"
                    />
                  </div>
                </Card>
              );
            })}
          {!picsLoaded && alert && (
            <Col lg={12}>
              <Alert variant="success">
                You have successfully sent your pictures to our database
              </Alert>
            </Col>
          )}
        </Row>
      </Container>
      {picsLoaded && (
        <Button onClick={confirmAlbum} className="my-3" variant="primary">
          Confirm album
        </Button>
      )}
    </>
  );
};

export default Albumreview;
