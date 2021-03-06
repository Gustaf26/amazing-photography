import { useState } from "react";
import { Form, Button, Container, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { user } = useMainContext();
  const navigate = useNavigate();

  const userLogin = (e) => {
    e.preventDefault();
    navigate("/albums");
    login(email, password);
  };

  return (
    <>
      {user === "" && (
        <Container>
          <Col lg={4} className="my-5 pt-5 mx-auto">
            <Form className="mx-auto form px-5 py-5" onSubmit={userLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Container>
      )}
    </>
  );
};

export default Login;
