import { useEffect, useState, useRef } from "react";
import { SRLWrapper } from "simple-react-lightbox";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Card, Media, Button } from "react-bootstrap";

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
    // resetPicsSelection,
    allPicsInDb,
    currentAlbum,
    albumPics,
    user,
  } = useMainContext();
  const allPicsFix = useRef([]);
  const [thisAlbumFix, setAlbumFix] = useState([]);
  const navigate = useNavigate();

  const updateAlbum = (e) => {
    e.preventDefault();
    setAllPics(allPicsFix.current);
    navigate(`/albums/${currentAlbum.code}/update`);
  };

  useEffect(() => {
    if (albumPics && albumPics.length) {
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
                if (pic.user === user.email) {
                  return (
                    <Card className="ml-3 mb-3" id="media" key={index}>
                      <Media key={pic.id} className="pic my-auto">
                        <img
                          width="100%"
                          height="auto"
                          src={pic.url}
                          alt="Generic placeholder"
                        />
                      </Media>
                      {/* <div className="d-flex mx-auto my-2">
                        <AddCircleOutlineIcon
                          // onClick={() => selectPic(pic.url, index)}
                          color="primary"
                        />
                        <IndeterminateCheckBoxIcon
                          onClick={() => deleteSelection(pic.url, index)}
                          color="secondary"
                        />
                      </div> */}
                    </Card>
                  );
                }
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
