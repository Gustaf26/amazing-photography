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
    allAlbums,
    clientAlbum,
    setClientAlbum,
  } = useMainContext();
  const allPicsFix = useRef([]);
  const navigate = useNavigate();
  const { albumId } = useParams();
  const [alert, setAlert] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const quantity = useRef(0);

  const selectPic = (url) => {
    let emptyArr;
    emptyArr = [];
    let fullArr;
    fullArr = [];
    fullArr = [...clientAlbum.photo_urls];

    fullArr.map((photo, index) => {
      if (photo === url || photo.url === url) {
        if (photo.selected) {
          return;
        } else {
          fullArr.splice(index, 1);
          fullArr.push({ url: photo.url ? photo.url : url, selected: true });
          quantity.current += 1;
        }
      }
    });
    if (fullArr.length) {
      setClientAlbum((prev) => {
        return { ...prev, photo_urls: [...fullArr] };
      });
    }
  };

  const deleteSelection = (url) => {
    let emptyArr;
    emptyArr = [];
    let fullArr;
    fullArr = [];
    fullArr = [...clientAlbum.photo_urls];

    fullArr.map((photo, index) => {
      if (photo === url || photo.url === url) {
        if (!photo.selected) {
          return;
        } else {
          fullArr.splice(index, 1);
          fullArr.push({ url: photo.url, selected: false });
          quantity.current -= 1;
        }
      }
    });
    if (fullArr.length) {
      setClientAlbum((prev) => {
        return { ...prev, photo_urls: [...fullArr] };
      });
    }
  };

  const updateAlbum = async (id) => {
    let ranNum;
    ranNum = Math.floor(Math.random() * 10000000);

    let emptyArr;
    emptyArr = [];
    clientAlbum.photo_urls.map((photo) =>
      photo.selected === true ? emptyArr.push(photo.url) : null
    );

    await db
      .collection("albums")
      .doc(id)
      .set({
        title: clientAlbum.title.toLowerCase(),
        cust_approved: true,
        photo_urls: [...emptyArr],
        code: ranNum,
        user: userEmail,
      })
      .then(function () {
        console.log("Document successfully written!");
        setLoaded(false);
        setAlert(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch(function (error) {
        setAlert(true);
        navigate("/");
        console.error("Error writing document: ", error);
      });
  };

  const confirmAlbum = async (e) => {
    e.preventDefault();
    setLoaded(false);

    if (quantity.current === 0) {
      alert("You need to choose at least 1 picture");
      return;
    }

    let albumsWithTitle = [];
    let albumToUpdate;
    db.collection("albums")
      .where("title", "==", clientAlbum.title.toLowerCase())
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          albumsWithTitle.push({ id: doc.id, data: doc.data() });
          if (albumsWithTitle.length) {
            albumToUpdate = albumsWithTitle.filter(
              (alb) => alb.data.user === userEmail
            );
          }
        });
        setTimeout(() => {
          updateAlbum(albumToUpdate[0].id);
        }, 2000);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  // await db
  //   .collection("albums")
  //   .doc(`${clientAlbum.title.toLowerCase()}`)
  //   .delete();

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      allPicsFix.current = [...allPicsInDb];

      setLoaded(true);
    }
  }, [allPicsInDb]);

  useEffect(() => {
    let emptyObj;
    let emptyUser;
    emptyObj = [];
    emptyUser = "";
    setAlert(true);
    allAlbums.map((alb) => {
      if (alb.code === Number(albumId)) {
        emptyObj = { ...alb };
        emptyUser = alb.user;
      }
    });
    if (emptyObj && emptyUser) {
      setClientAlbum(emptyObj);
      setUserEmail(emptyUser);
      setLoaded(true);
      setAlert(false);
    }
  }, []);

  return (
    <>
      <Container>
        <Col lg={12}>
          {clientAlbum && clientAlbum.photo_urls && !alert ? (
            <Alert variant="warning">
              You have chosen {quantity.current} of{" "}
              {clientAlbum.photo_urls.length} photos
            </Alert>
          ) : (
            <Alert variant="success">
              You have successfully sent your pictures to our database
            </Alert>
          )}
        </Col>
        <Row lg={9} className="d-flex mt-5 mx-auto">
          {picsLoaded &&
            clientAlbum &&
            !alert &&
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
                      onClick={() => selectPic(photo)}
                      color="primary"
                    />
                    <IndeterminateCheckBoxIcon
                      onClick={() => deleteSelection(photo)}
                      color="secondary"
                    />
                  </div>
                </Card>
              );
            })}
        </Row>
      </Container>
      {!alert && clientAlbum && clientAlbum.photo_urls && (
        <Button onClick={confirmAlbum} className="my-3" variant="primary">
          Confirm and send
        </Button>
      )}
    </>
  );
};

export default Albumreview;
