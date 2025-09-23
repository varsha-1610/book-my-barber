import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminReducer from "../adminSlice";
import userReducer from "../shopSlice"; 
import clientReducer from "../clientSlice";

const adminPersistConfig = {
  key: "admin",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
};

const clientPersistConfig = {
  key: "client",
  storage,
};

const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedClientReducer = persistReducer(clientPersistConfig, clientReducer);

const store = configureStore({
  reducer: {
    admin: persistedAdminReducer,
    user: persistedUserReducer,
    client: persistedClientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 👇 ignore redux-persist actions that contain non-serializable values
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
