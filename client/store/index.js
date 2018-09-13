import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';



const requestFields = {
  verb: 'POST',
  path: '/products.json',
  params: JSON.stringify({
    product: {
      title: "Burton Custom Freestyle 151",
      body_html: "<strong>Good snowboard!<\/strong>",
      vendor: "Burton",
      product_type: "Snowboard"
    }
  }, null, 2)
};

const initState = {
  requestFields,
  requestInProgress: false,
  requestError: null,
  responseBody: '',

  selectAllProducts: false,
  productIds: [],

  selectAllVariants: [],
  inventoryIds: [],
  priceIds: [],


};


function reducer(state = initState, action) {
  switch (action.type) {

    case "SELECT_ALL_PRODUCTS":
      return {
        ...state,
        selectAllProducts: action.payload
      };

    case "UNSELECT_ALL_PRODUCTS":
      return {
        ...state,
        selectAllProducts: false
      };

    case "ADD_PRODUCT_ID":
      return {
        ...state,
        productIds: [
          ...state.productIds,
          action.payload
        ]
      }

    case "REMOVE_PRODUCT_ID":
      return {
        ...state,
        productIds: state.productIds.filter((item) => item !== action.payload)
      }

    case "ADD_INVENTORY_ID":
      return {
        ...state,
        inventoryIds: [
          ...state.inventoryIds,
          action.payload
        ]
      };
    case "REMOVE_INVENTORY_ID":
      return {
        ...state,
        inventoryIds: state.inventoryIds.filter((item) => item !== action.payload)
      };

    case "ADD_PRICE_ID":
      return {
        ...state,
        priceIds: [
          ...state.priceIds,
          action.payload
        ]
      };

    case "REMOVE_PRICE_ID":
      return {
        ...state,
        priceIds: state.priceIds.filter((item) => item !== action.payload)
      }

    case 'UPDATE_VERB':
      return {
        ...state,
        responseBody: '',
        requestFields: {
          ...state.requestFields,
          verb: action.payload.verb,
        },
      };
    case 'UPDATE_PATH':
      return {
        ...state,
        responseBody: '',
        requestFields: {
          ...state.requestFields,
          path: action.payload.path,
        },
      };
    case 'UPDATE_PARAMS':
      return {
        ...state,
        responseBody: '',
        requestFields: {
          ...state.requestFields,
          params: action.payload.params,
        },
      };
    case 'REQUEST_START':
      return {
        ...state,
        requestInProgress: true,
        requestError: null,
        responseBody: ''
      };
    case 'REQUEST_COMPLETE':
      return {
        ...state,
        requestInProgress: false,
        requestError: null,
        responseBody: action.payload.responseBody
      };
    case 'REQUEST_ERROR':
      return {
        ...state,
        requestInProgress: false,
        requestError: action.payload.requestError,
      };
    default:
      return state;
  }
}

const middleware = applyMiddleware(thunkMiddleware, logger);

const store = createStore(reducer, middleware);

export default store;




