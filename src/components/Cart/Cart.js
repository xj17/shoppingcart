import React, { useState, useEffect } from "react";
import { Drawer, Button, List, Row, Col, Badge, Image } from "antd";
import { connect } from "dva";
import MyIcon from "../../assets/Font";
import "./cart.css";
import "antd/dist/antd.css";

const Cart = ({ data, dispatch }) => {
  useEffect(() => {
    if (window.localStorage.cart_data) {
      dispatch({
        type: "cart/updateCart",
      });
    }
  }, []);
  const [visible, serVisible] = useState(0);
  const total = data
    .reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0)
    .toFixed(2);
  const count = data.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  function getWidth() {
    let cart_width = 0;
    let w = document.documentElement.clientWidth;
    if (w > 1300) {
      cart_width = 30;
    } else if (w <= 1300 && w > 1000) {
      cart_width = 40;
    } else if (w <= 1000 && w > 700) {
      cart_width = 60;
    } else if (w <= 700 && w > 600) {
      cart_width = 70;
    } else if (w <= 600) {
      cart_width = 100;
    }
    return cart_width;
  }

  return (
    <div>
      <div className="small_cart">
        <MyIcon
          type="icon-gouwuche"
          onClick={() => {
            serVisible(1);
          }}
        />
        <Badge count={count} className="head-example"></Badge>
      </div>

      <div>
        <Drawer
          title={
            <div className="inside-cart">
              <div className="content-title">
                <MyIcon type="icon-gouwuche1" />
                <Badge count={count} className="badge-inside"></Badge>
                <span className="cart-title">Cart</span>
              </div>
            </div>
          }
          footer={
            <div>
              <div className="total">
                <Row>
                  <Col span={12}>总价</Col>
                  <Col span={12}>${total}</Col>
                </Row>
              </div>
              <Button
                type="primary"
                style={{ marginTop: "20px" }}
                block
                onClick={() => {
                  dispatch({
                    type: "cart/clearCar",
                    payload: {
                      cart_quantity: data,
                    },
                  });
                }}
              >
                清空购物车
              </Button>
            </div>
          }
          placement="right"
          closable={true}
          onClose={() => {
            serVisible(0);
          }}
          visible={visible}
          width={`${getWidth()}%`}
        >
          <List
            bordered
            dataSource={data}
            itemLayout="vertical"
            size="large"
            renderItem={(item, index) => (
              <List.Item key={item.sku}>
                <Row gutter={[10, 0]}>
                  <Col span={8}>
                    <Image
                      src={`./img/${item.product.sku}_2.jpg`}
                      alt="裂开"
                      className="imgs"
                    />
                  </Col>
                  <Col span={8}>
                    <p>{item.product.title}</p>
                    <div className="cart-good-name">
                      <span>
                        {item.size} | {item.product.style}
                      </span>
                    </div>
                    <p className="cart-quantity">Quantity:{item.quantity}</p>
                  </Col>
                  <Col span={8} className="cart_right">
                    <Button
                      className="exit"
                      onClick={(index) => {
                        dispatch({
                          type: "cart/deleteItem",
                          payload: {
                            delete_id: item.product_id,
                            size: item.size,
                            index: index,
                            quantity: item.quantity,
                          },
                        });
                      }}
                    >
                      ×
                    </Button>
                    <div className="cart-good-price-box">
                      <p className="cart-good-price">
                        {item.product.currencyFormat}
                        {item.product.price}
                      </p>
                    </div>
                    <div>
                      <Button
                        type="primary"
                        disabled={item.quantity === 1}
                        onClick={() => {
                          dispatch({
                            type: "cart/decrease",
                            payload: {
                              id: item.product_id,
                              Csize: item.size,
                            },
                          });
                        }}
                        size="small"
                      >
                        -
                      </Button>
                      &nbsp;
                      <Button
                        type="primary"
                        onClick={() => {
                          dispatch({
                            type: "cart/increase",
                            payload: {
                              id: item.product_id,
                              remainder: item.product.installments > 0 ? 1 : 0,
                              Csize: item.size,
                            },
                          });
                        }}
                        size="small"
                        
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Drawer>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    data: state.cart.data,
  };
};

export default connect(mapStateToProps)(Cart);
