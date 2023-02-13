import storage from 'redux-persist/lib/storage'

import { persistReducer } from 'redux-persist'
import { combineReducers,configureStore } from '@reduxjs/toolkit'

import userStateReducer from './user'
import settingsReducer from './settings'
import modalStateReducer from './modals'

const rootReducer = combineReducers({
    userState: userStateReducer,
    settings: settingsReducer,
    modalState: modalStateReducer
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
