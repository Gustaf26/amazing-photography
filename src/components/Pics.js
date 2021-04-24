import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/index";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";
import { SRLWrapper } from "simple-react-lightbox";
import { Container, Row, Card, Media, Button } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const options = {
  buttons: {
    backgroundColor: "rgba(140, 94, 88, 0.8)",
    iconColor: "rgba(241, 191, 152, 0.7)",
  },
  settings: {
    overlayColor: "rgba(255, 237, 225, 1)",
    transitionSpeed: 1000,
    transitionTimingFunction: "linear",
  },
  thumbnails: {
    thumbnailsSize: ["120px", "100px"],
    thumbnailsOpacity: 0.4,
  },
  caption: {
    captionColor: "rgba(241, 191, 152, 1)",
  },
  progressBar: {
    size: "4px",
    backgroundColor: "rgba(255, 237, 225, 1)",
    fillColor: "#AF9AB2",
  },
};

const Pics = () => {
  const [picsLoaded, setLoaded] = useState(false);
  const {
    setAllPics,
    allPicsInDb,
    resetPicsSelection,
    user,
  } = useMainContext();
  const allPicsFix = useRef([]);
  const navigate = useNavigate();

  const selectPic = (pic) => {
    allPicsFix.current.map((picture) => {
      if (picture.url === pic) {
        return (picture.selected = true);
      }
    });

    db.collection("pics")
      .doc("all-pics")
      .set({ ...allPicsFix.current })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const deleteSelection = (pic) => {
    allPicsFix.current.map((picture) => {
      if (picture.url === pic) {
        console.log({ ...allPicsFix.current });
        return (picture.selected = false);
      }
    });
    db.collection("pics")
      .doc("all-pics")
      .set({ ...allPicsFix.current })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const createAlbum = (e) => {
    e.preventDefault();
    setAllPics(allPicsFix.current);
    navigate("/albums/create");
  };

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      allPicsFix.current = [...allPicsInDb];

      setLoaded(true);
    }
  }, [allPicsInDb]);

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      resetPicsSelection();
    }
  }, []);

  return (
    <>
      <Container>
        <SRLWrapper options={options}>
          <Row lg={9} md={10} className="d-flex mt-5 mx-auto">
            {picsLoaded &&
              allPicsFix.current &&
              allPicsFix.current.map((pic, index) => {
                if (pic.user === user.email) {
                  return (
                    <Card
                      className={
                        pic.selected
                          ? "pic-selected ml-3 mb-3"
                          : "not-selected ml-3 mb-3"
                      }
                      id="media"
                      key={index}
                    >
                      <Media key={pic.id} className="pic my-auto">
                        <img
                          width="100%"
                          height="auto"
                          src={pic.url}
                          alt="Generic placeholder"
                        />
                      </Media>
                      <div className="d-flex mx-auto my-2">
                        <AddCircleOutlineIcon
                          onClick={() => selectPic(pic.url)}
                          color="primary"
                        />
                        <IndeterminateCheckBoxIcon
                          onClick={() => deleteSelection(pic.url)}
                          color="secondary"
                        />
                      </div>
                    </Card>
                  );
                }
              })}
          </Row>
        </SRLWrapper>
      </Container>
      <Button onClick={createAlbum} className="my-3" variant="primary">
        Create From Selection
      </Button>
    </>
  );
};

export default Pics;
