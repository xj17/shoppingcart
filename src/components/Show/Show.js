import React, { useEffect } from "react";
import {
  Row,
  Col,
  Menu,
  Button,
  Dropdown,
  Card,
  Image,
  message,
  Tag,
  Popover,
} from "antd";
import "./show.css";
import "antd/dist/antd.css";
import { DownOutlined } from "@ant-design/icons";
import { connect } from "dva";

function Show({ dispatch, products }) {
  useEffect(() => {
    if (window.localStorage.show_data) {
      dispatch({
        type: "products/setStorage",
      });
    } else {
      dispatch({
        type: "products/fetch",
        payload: {
          page: 1,
        },
      });
    }
  }, []);
console.log(products)
  return (
    <div className="allWife">
      <Row className="choose" gutter={[10, 10]}>
        <Col xs={24} sm={12}>
          发现{products.length}件商品
        </Col>
        <Col xs={24} sm={12}>
          排序&nbsp;&nbsp;
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    dispatch({
                      type: "products/recoverDefault",
                    });
                  }}
                >
                  默认排序
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    dispatch({
                      type: "products/changeUp",
                    });
                  }}
                >
                  价格升序
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    dispatch({
                      type: "products/changeDown",
                    });
                  }}
                >
                  价格降序
                </Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              排序选择 <DownOutlined />
            </a>
          </Dropdown>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        {products.map((item, index) => {
          return (
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={6}
              xxl={6}
              key={index + item}
            >
              <Card bordered hoverable className="wife">
                <Image
                  src={`./img/${item.sku}_1.jpg`}
                  alt="图片未加载"
                  style={{ width: "100%" }}
                />
                <div className="price">
                  <div className="show-title">{item.title}</div>
                  <hr className="line" />
                  {item.currencyFormat}
                  <span className="show-price"> {item.price}</span>
                </div>
                <Popover
                  content={item.availableSizes.map((current, index) => {
                    return (
                      <Button
                        key={index}
                        className="size-title"
                        disabled={item.installments === 0}
                        onClick={() => {
                          dispatch({
                            type: "cart/addCart",
                            payload: {
                              product_id: item.id,
                              quantity: item.installments > 0 ? 1 : 0,
                              size: current,
                              product: item,
                            },
                          });
                          message.success("添加购物车成功");
                          if (item.installments === 0) {
                            message.warning("商品被买完啦");
                          }
                        }}
                      >
                        {current}
                      </Button>
                    );
                  })}
                  title="尺码选择"
                >
                  <Button type="primary" size="large" style={{ width: "100%" }}>
                    添加
                  </Button>
                </Popover>
                <Tag className="tag" color="#2db7f5">
                  {item.isFreeShipping ? "isFreeShipping" : "noFreeShipping"}
                </Tag>
                <span className="kucun">库存：{item.installments}</span>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

const mapStateToProps = ({ products }) => ({
  products: products.sortData,
});

export default connect(mapStateToProps)(Show);
