import * as api from "../api/index";

const products = {
  namespace: "products",
  state: {
    data: [],
    sortData: [],
    onSize: ["XS", "S", "M", "ML", "L", "XL", "XXL"],
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      const data = yield call(api.getProducts, { page });
      yield put({ type: "save", payload: { data } });
    },
    *recoverDefault({ payload }, { put }) {
      yield put({ type: "sortGoodDefault" });
    },
    *changeUp({ payload }, { call, put }) {
      yield put({ type: "sortGoodUp" });
    },
    *changeDown({ payload }, { call, put }) {
      yield put({ type: "sortGoodDown" });
    },
    *setStorage({ payload }, { put }) {
      yield put({
        type: "storageData",
        payload: {
          paroduct_data: JSON.parse(window.localStorage.paroduct_data),
          show_data: JSON.parse(window.localStorage.show_data),
          paroduct_size: JSON.parse(window.localStorage.paroduct_size),
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {

      const {onSize}  = state
      const storage = window.localStorage;
      let paroduct_data = JSON.stringify(payload.data);
      let show_data = JSON.stringify(payload.data);
      let paroduct_size = JSON.stringify(onSize);
      storage.setItem("paroduct_data", paroduct_data);
      storage.setItem("show_data", show_data);
      storage.setItem("paroduct_size", paroduct_size);
      return {
        ...state,
        data: payload.data,
        sortData: payload.data,
      };
    },
    loseItem(state, { payload }) {
      let newData = state.data.map((item) => {
        if (item.id === payload.product_id && item.installments > 0) {
          --item.installments;
          return item;
        }
        return item;
      });
      let newSortData = state.sortData.map((item) => {
        if (item.id === payload.product_id && item.installments > 0) {
          --item.installments;
          return item;
        }
        return item;
      });
      const storage = window.localStorage;
      let paroduct_data = JSON.stringify(newData);
      let show_data = JSON.stringify(newSortData);
      storage.setItem("paroduct_data", paroduct_data);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        data: newData,
        sortData: newSortData,
      };
    },
    addGood(state, { payload }) {
      let newData = state.data.map((item) => {
        if (item.id === payload.id && item.installments > 0) {
          --item.installments;
          return item;
        }
        return item;
      });
      let newSortData = state.sortData.map((item) => {
        if (item.id === payload.id && item.installments > 0) {
          --item.installments;
          return item;
        }
        return item;
      });
      const storage = window.localStorage;
      let paroduct_data = JSON.stringify(newData);
      let show_data = JSON.stringify(newSortData);
      storage.setItem("paroduct_data", paroduct_data);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        data: newData,
        sortData: newSortData,
      };
    },
    cutGood(state, { payload }) {
      let newData = state.data.map((item) => {
        if (item.id === payload.id) {
          item.installments += 1;
          return item;
        }
        return item;
      });
      let newSortData = state.sortData.map((item) => {
        if (item.id === payload.id) {
          item.installments += 1;
          return item;
        }
        return item;
      });
      const storage = window.localStorage;
      let paroduct_data = JSON.stringify(newData);
      let show_data = JSON.stringify(newSortData);
      storage.setItem("paroduct_data", paroduct_data);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        data: newData,
        sortData: newSortData,
      };
    },
    //默认排序
    sortGoodDefault(state, action) {
      const { sortData } = state;
      let newData = JSON.parse(JSON.stringify(sortData));
      for (let i = 0; i < newData.length - 1; i++) {
        for (let j = i; j < newData.length - 1; j++) {
          if (newData[i].id > newData[i + 1].id) {
            let temp = [];
            temp = newData[i];
            newData[i] = newData[i + 1];
            newData[i + 1] = temp;
          }
        }
      }
      const storage = window.localStorage;
      let show_data = JSON.stringify(newData);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        sortData: newData,
      };
    },
    //价格升序
    sortGoodUp(state, action) {
      let arrPrice = state.sortData.map((item) => {
        return item.price;
      });
      function sortPriceUp(a, b) {
        return a - b;
      }
      const up = arrPrice.sort(sortPriceUp);
      let newProducts = JSON.parse(JSON.stringify(state.sortData));
      let newArr = [];
      for (let i = 0; i < up.length; i++) {
        for (let j = 0; j < state.sortData.length; j++) {
          if (newProducts[j]?.price === up[i]) {
            newArr.push(newProducts[j]);
            newProducts.splice(j, 1);
            continue;
          }
        }
      }
      const storage = window.localStorage;
      let show_data = JSON.stringify(newArr);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        sortData: newArr,
      };
    },
    //价格降序
    sortGoodDown(state, action) {
      let arrPrice = state.sortData.map((item) => {
        return item.price;
      });
      function sortPriceDown(a, b) {
        return b - a;
      }
      const down = arrPrice.sort(sortPriceDown);
      let newProducts = JSON.parse(JSON.stringify(state.sortData));
      let newArr = [];
      for (let i = 0; i < down.length; i++) {
        for (let j = 0; j < state.sortData.length; j++) {
          if (newProducts[j]?.price === down[i]) {
            newArr.push(newProducts[j]);
            newProducts.splice(j, 1);
            continue;
          }
        }
      }
      const storage = window.localStorage;
      let show_data = JSON.stringify(newArr);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        sortData: newArr,
      };
    },
    //清空购物车恢复库存
    recover(state, { payload }) {
      let newArr = JSON.parse(JSON.stringify(state.data));
      for (let i = 0; i < payload.cart_quantity.length; i++) {
        for (let j = 0; j < newArr.length; j++) {
          if (newArr[j].id === payload.cart_quantity[i].product_id) {
            newArr[j].installments += payload.cart_quantity[i].quantity;
          }
        }
      }
      let newArr1 = JSON.parse(JSON.stringify(state.sortData));
      for (let i = 0; i < payload.cart_quantity.length; i++) {
        for (let j = 0; j < newArr1.length; j++) {
          if (newArr1[j].id === payload.cart_quantity[i].product_id) {
            newArr1[j].installments += payload.cart_quantity[i].quantity;
          }
        }
      }
      const storage = window.localStorage;
      let paroduct_data = JSON.stringify(newArr);
      let show_data = JSON.stringify(newArr1);
      storage.setItem("paroduct_data", paroduct_data);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        data: newArr,
        sortData: newArr1,
      };
    },
    //删除商品返回库存
    recoverItem(state, { payload }) {
      let newArr = JSON.parse(JSON.stringify(state.data));
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].id === payload.delete_id) {
          newArr[i].installments += payload.quantity;
          break;
        }
      }
      let newArr1 = JSON.parse(JSON.stringify(state.sortData));
      for (let i = 0; i < newArr1.length; i++) {
        if (newArr1[i].id === payload.delete_id) {
          newArr1[i].installments += payload.quantity;
          break;
        }
      }
      const storage = window.localStorage;
      let paroduct_data = JSON.stringify(newArr);
      let show_data = JSON.stringify(newArr1);
      storage.setItem("paroduct_data", paroduct_data);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        data: newArr,
        sortData: newArr1,
      };
    },
    //更新已选尺码
    changeOnSize(state, { payload: { checked, size } }) {
      let { onSize } = state;
      if (checked) {
        onSize = [...onSize, size];
      } else {
        onSize = onSize.filter((item) => {
          return item !== size;
        });
      }
      console.log(onSize);
      const storage = window.localStorage;
      let paroduct_size = JSON.stringify(onSize);
      storage.setItem("paroduct_size", paroduct_size);
      return {
        ...state,
        onSize,
      };
    },
    //按钮更新商品列表
    updateList(state, { payload: { sizes } }) {
      let { data, onSize } = state;
      let newData = JSON.parse(JSON.stringify(data));
      let newArr = [];
      for (let i = 0; i < onSize.length; i++) {
        for (let j = 0; j < newData.length; j++) {
          if (newData[j].availableSizes.includes(onSize[i])) {
            newArr.push(newData[j]);
            newData.splice(j, 1);
            --j;
          }
        }
      }
      const storage = window.localStorage;
      let show_data = JSON.stringify(newArr);
      storage.setItem("show_data", show_data);
      return {
        ...state,
        sortData: newArr,
      };
    },
    storageData(state, { payload }) {
      return {
        ...state,
        data: payload.paroduct_data,
        sortData: payload.show_data,
        onSize: payload.paroduct_size,
      };
    },
  },
};
export default products;
