import React from "react";
import { Row, Col, Checkbox, Button } from "antd";
import "antd/dist/antd.css";
import { connect } from "dva";
import "./chioce.css";

const Chioce = ({ dispatch, onSize }) => {
  const size = ["XS", "S", "M", "ML", "L", "XL", "XXL"];
  return (
    <div className="boxs">
      <h1>Sizes:</h1>
      <Row gutter={[30, 20]}>
        {size.map((item, index) => {
          return (
            <Col key={item + index}>
              <Checkbox
                checked={onSize.includes(item)}
                onClick={() => {
                  dispatch({
                    type: "products/changeOnSize",
                    payload: {
                      checked: !onSize.includes(item),
                      size: item,
                    },
                  });
                }}
              >
                {item}
              </Checkbox>
            </Col>
          );
        })}
      </Row>
      <Button
        style={{ width: "100%" }}
        onClick={() => {
          dispatch({
            type: "products/updateList",
            payload: {
              sizes: onSize,
            },
          });
        }}
      >
        筛选
      </Button>
    </div>
  );
};

const mapStateToProps = ({ products }) => {
  return {
    onSize: products.onSize,
  };
};
export default connect(mapStateToProps)(Chioce);
