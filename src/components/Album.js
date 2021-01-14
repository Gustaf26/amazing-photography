import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/index";
import { SRLWrapper } from "simple-react-lightbox";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";
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

const Album = () => {
  const [picsLoaded, setLoaded] = useState(false);
  const {
    setAllPics,
    resetPicsSelection,
    allPicsInDb,
    currentAlbum,
    albumPics,
  } = useMainContext();
  const allPicsFix = useRef([]);
  const [thisAlbumFix, setAlbumFix] = useState([]);
  const navigate = useNavigate();

  const selectPic = (pic, ind) => {
    allPicsFix.current.map((picture) => {
      if (picture.url === pic) {
        console.log({ ...allPicsFix.current });
        return (picture.selected = true);
      }
    });

    let emptyArr;

    emptyArr = [...thisAlbumFix];

    allPicsFix.current.map((pic) => {
      emptyArr.map((albumPic, index) => {
        if (albumPic.url === pic.url && pic.selected === true) {
          emptyArr.splice(index, 1);
          emptyArr.push(pic);
        }
      });
    });

    setAlbumFix([...emptyArr]);
    emptyArr = [];

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

  const deleteSelection = (pic, ind) => {
    allPicsFix.current.map((picture) => {
      if (picture.url === pic) {
        console.log({ ...allPicsFix.current });
        return (picture.selected = false);
      }
    });

    let emptyArr;

    emptyArr = [...thisAlbumFix];

    allPicsFix.current.map((pic) => {
      emptyArr.map((albumPic, index) => {
        if (albumPic.url === pic.url && pic.selected === false) {
          emptyArr.splice(index, 1);
          emptyArr.push(pic);
        }
      });
    });

    setAlbumFix([...emptyArr]);
    emptyArr = [];

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

  const updateAlbum = (e) => {
    e.preventDefault();
    setAllPics(allPicsFix.current);
    navigate(`/albums/${currentAlbum.code}/update`);
  };

  useEffect(() => {
    if (albumPics && albumPics.length) {
      resetPicsSelection();
      setAlbumFix([...albumPics]);

      setLoaded(true);
    }
  }, [albumPics]);

  useEffect(() => {
    if (allPicsInDb && allPicsInDb.length) {
      allPicsFix.current = [...allPicsInDb];

      setLoaded(true);
    }
  }, [allPicsInDb]);

  return (
    <>
      <Container>
        <SRLWrapper options={options}>
          <Row lg={9} className="d-flex mt-5 mx-auto">
            {picsLoaded &&
              thisAlbumFix.length &&
              thisAlbumFix.map((pic, index) => {
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
                        onClick={() => selectPic(pic.url, index)}
                        color="primary"
                      />
                      <IndeterminateCheckBoxIcon
                        onClick={() => deleteSelection(pic.url, index)}
                        color="secondary"
                      />
                    </div>
                  </Card>
                );
              })}
          </Row>
        </SRLWrapper>
      </Container>
      <Button onClick={updateAlbum} className="my-3" variant="primary">
        Update Album
      </Button>
    </>
  );
};

export default Album;
