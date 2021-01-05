import React from "react";
import { Row, Col } from "antd";
import "antd/dist/antd.css";
import Chioce from "./components/Chioce/Chioce";
import Show from "./components/Show/Show";
import Cart from "./components/Cart/Cart";

function App() {
  return (
    <div>
      <Row>
        <Col span={6}>
          <Chioce />
        </Col>
        <Col span={16}>
          <Show />
        </Col>
        <Col span={2}>
          <Cart />
        </Col>
      </Row>
    </div>
  );
}

export default App;
