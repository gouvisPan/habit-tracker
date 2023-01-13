import * as api from "../../api/AuthService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import SignUpCredentials from "../../model/interfaces/SignupCredentials";
import SignInCredentials from "../../model/interfaces/SignInCredentials";
import { normalizeAuthUser } from "../../helpers/normalizeAuthUser";
import { createUser, fetchUser } from "./user-actions";
import { fetchHabitList } from "./habit-actions";
import { habitActions } from "../reducers/habitSlice";

export const signUpUser = createAsyncThunk(
  "auth/signUp",
  async (credentials: SignUpCredentials, thunkApi) => {
    try {
      const response = await api.signUpUser(credentials);
      const normalizedUser = normalizeAuthUser(response);
      normalizedUser.name = credentials.name;
      thunkApi.dispatch(habitActions.clearHabits());
      thunkApi.dispatch(createUser(normalizedUser));
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/signIn",
  async (credentials: SignInCredentials, thunkApi) => {
    try {
      const response = await api.signInUser(credentials);
      const uid = response.user.uid;
      thunkApi.dispatch(fetchUser(uid));
      thunkApi.dispatch(fetchHabitList(uid));
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/signOut",
  async (_: void, thunkApi) => {
    try {
      const response = await api.signOutUser();

      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
