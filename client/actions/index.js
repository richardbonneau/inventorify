export function updateVerb(verb) {
  return {
    type: 'UPDATE_VERB',
    payload: {
      verb,
    },
  };
}

export function updatePath(path) {
  return {
    type: 'UPDATE_PATH',
    payload: {
      path,
    },
  };
}

export function updateParams(params) {
  return {
    type: 'UPDATE_PARAMS',
    payload: {
      params,
    },
  };
}

export function sendRequest(requestFields) {
  const { verb, path, params } = requestFields;

  const fetchOptions = {
    method: verb,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  }

  if (verb !== 'GET') {
    fetchOptions['body'] = params
  }

  return dispatch => {
    dispatch(requestStartAction());

    return fetch(`/shopify/api${path}`, fetchOptions)
      .then(response => response.json())
      .then(json => dispatch(requestCompleteAction(json)))
      .catch(error => {
        dispatch(requestErrorAction(error));
      });
  };
}

function requestStartAction() {
  return {
    type: 'REQUEST_START',
    payload: {},
  };
}

function requestCompleteAction(json) {
  const responseBody = JSON.stringify(json, null, 2);

  return {
    type: 'REQUEST_COMPLETE',
    payload: {
      responseBody
    },
  };
}

function requestErrorAction(requestError) {
  return {
    type: 'REQUEST_ERROR',
    payload: {
      requestError,
    },
  };
}


// Richard

export const addInventoryId = inventoryId => ({ type: "ADD_INVENTORY_ID", payload: inventoryId });
export const removeInventoryId = inventoryId => ({ type: "REMOVE_INVENTORY_ID", payload: inventoryId });

export const addPriceId = priceId => ({ type: "ADD_PRICE_ID", payload: priceId });
export const removePriceId = priceId => ({ type: "REMOVE_PRICE_ID", payload: priceId });

export const addProductId = productId => ({ type: "ADD_PRODUCT_ID", payload: productId });
export const removeProductId = productId => ({ type: "REMOVE_PRODUCT_ID", payload: productId });

export const selectAllProducts = (bool) => ({ type: "SELECT_ALL_PRODUCTS", payload: bool });

export const addAllVariants = (productId) => ({ type: "ADD_ALL_VARIANTS", payload: productId });
export const removeAllVariants = (productId) => ({ type: "REMOVE_ALL_VARIANTS", payload: productId });

export const addColorVariantId = id => ({ type: "ADD_COLOR_VARIANT_ID", payload: id });
export const removeColorVariantId = id => ({ type: "REMOVE_COLOR_VARIANT_ID", payload: id });

export const selectEveryVariants = bool => ({ type: "SELECT_EVERY_VARIANTS", payload: bool });

export const createAllPossibleVariants = obj => ({ type: "CREATE_ALL_POSSIBLE_VARIANTS", payload: obj })
export const selectEveryColor = key => ({ type: "SELECT_EVERY_COLOR", payload: key });
export const unselectEveryColor = key => ({ type: "UNSELECT_EVERY_COLOR", payload: key });