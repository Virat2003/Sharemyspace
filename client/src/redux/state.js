import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } catch (e) {
        // ignore
      }
    },
    setLogout: (state)=>{
      state.user=null
      state.token=null
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {}
    },
    setListings : (state, action) => {
      state.listings = action.payload.listings;
    },
    setBookingList: (state, action)=> {
      state.user.bookingList = action.payload
    },
      setPropertyList: (state, action) => {
        if (!state.user) state.user = {};
        state.user.propertyList = action.payload;
      }
  }
});

export const { setLogin,setLogout, setListings, setBookingList, setPropertyList } = userSlice.actions;
export default userSlice.reducer;
