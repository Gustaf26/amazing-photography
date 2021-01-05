import { Container, Col, Media } from "react-bootstrap";

const Home = () => {
  return (
    <>
      <Container>
        <Col lg={7} className="my-5 pt-3 mx-auto">
          <Media id="media">
            <img
              width="100%"
              height="auto"
              src="https://images.unsplash.com/photo-1596923322832-ada855ab1a61?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mzl8fHBob3RvZ3JhcGh5JTIwY2FtZXJhfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Generic placeholder"
            />
            <Media.Body id="pic-message">
              <h2>Welcome to Amazing Photography</h2>
              <p>This is the place where your photo dreams become true</p>
            </Media.Body>
          </Media>
        </Col>
      </Container>
    </>
  );
};

export default Home;
