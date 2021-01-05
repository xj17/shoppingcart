const cart = {
  namespace: "cart",
  state: {
    data: [],
  },
  reducers: {
    //添加物品到购物车
    saveItem(state, { payload }) {
      let newData = [];
      const finded = state.data.find((item) => {
        return (
          item.product_id === payload.product_id && item.size === payload.size
        );
      });
      if (finded) {
        finded.quantity += payload.quantity;
        newData = state.data.map((item) =>
          item.product_id === finded.product_id && item.size === finded.size
            ? finded
            : item
        );
      } else {
        newData = [...state.data, payload];
      }
      const storage = window.localStorage;
      let cart_data = JSON.stringify(newData);
      storage.setItem("cart_data", cart_data);
      return {
        data: newData,
      };
    },
    cleanCar(state, action) {
      const cleanArr = [];
      const storage = window.localStorage;
      let cart_data = JSON.stringify(cleanArr);
      storage.setItem("cart_data", cart_data);
      return {
        data: cleanArr,
      };
    },
    deleteItem_cart(state, { payload }) {
      let newData = JSON.parse(JSON.stringify(state.data));
      newData.splice(payload.index, 1);
      const storage = window.localStorage;
      let cart_data = JSON.stringify(newData);
      storage.setItem("cart_data", cart_data);
      return {
        data: newData,
      };
    },
    addOne(state, { payload }) {
      let newData = [];
      const finded = state.data.find((item) => {
        return item.product_id === payload.id && item.size === payload.Csize;
      });
      if (finded) {
        finded.quantity += payload.remainder;
        newData = state.data.map((item) => {
          return item.product_id === finded.product_id &&
            item.size === payload.Csize
            ? finded
            : item;
        });
      }
      const storage = window.localStorage;
      let cart_data = JSON.stringify(newData);
      storage.setItem("cart_data", cart_data);
      return {
        data: newData,
      };
    },
    cutOne(state, { payload }) {
      let newData = [];
      const finded = state.data.find((item) => {
        return item.product_id === payload.id && item.size === payload.Csize;
      });
      if (finded) {
        finded.quantity = finded.quantity - 1;
        newData = state.data.map((item) => {
          return item.product_id === finded.product_id &&
            item.size === payload.Csize
            ? finded
            : item;
        });
      }
      const storage = window.localStorage;
      let cart_data = JSON.stringify(newData);
      storage.setItem("cart_data", cart_data);
      return {
        data: newData,
      };
    },
    //页面加载刷新购物车数据
    updateCartData(state, { payload }) {
      return {
        ...state,
        data: payload.cart_data,
      };
    },
  },
  effects: {
    *addCart({ payload }, { call, put }) {
      yield put({ type: "products/loseItem", payload });
      yield put({ type: "saveItem", payload });
    },
    *increase({ payload }, { call, put }) {
      yield put({ type: "products/addGood", payload });
      yield put({ type: "addOne", payload });
    },
    *decrease({ payload }, { call, put }) {
      yield put({ type: "products/cutGood", payload });
      yield put({ type: "cutOne", payload });
    },
    *clearCar({ payload }, { call, put }) {
      yield put({ type: "cleanCar" });
      yield put({ type: "products/recover", payload });
    },
    *deleteItem({ payload }, { call, put }) {
      yield put({ type: "deleteItem_cart", payload });
      yield put({ type: "products/recoverItem", payload });
    },
    *updateCart({ payload }, { put }) {
      yield put({
        type: "updateCartData",
        payload: {
          cart_data: JSON.parse(window.localStorage.cart_data),
        },
      });
    },
  },
};
export default cart;
