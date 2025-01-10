import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default

import authReducer from "./slices/authSlice";
import appReducer from "./slices/appSlice";
import addressReducer from "./slices/addressSlice";
import { injectStore } from "../utils/api";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import deliveryReducer from "./slices/deliverySlice";
import categoryReducer from "./slices/categorySlice";
import paymentReducer from "./slices/paymentSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth", "cart"], // Only persist these reducers
  // blacklist: ['someReducer'] // Don't persist these reducers
  migrate: (state) => {
    // Perform any state migrations here
    // if (state._persist.version === 1) {
    //   return Promise.resolve({
    //     ...state,
    //     cart: {
    //       ...state.cart,
    //       items: state.cart.items.map(item => ({
    //         ...item,
    //         addedAt: Date.now()
    //       }))
    //     }
    //   })
    // }
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  address: addressReducer,
  cart: cartReducer,
  product: productReducer,
  delivery: deliveryReducer,
  category: categoryReducer,
  payment: paymentReducer,
  checkout: checkoutReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: false,
  // .concat((store) => (next) => (action) => {
  //   // Log all actions
  //   console.log("Dispatching:", action);
  //   const result = next(action);
  //   console.log("New State:", store.getState());
  //   return result;
  // }),
});

injectStore(store);

// Create persistor
export const persistor = persistStore(store);
