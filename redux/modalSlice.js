import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signUpModalOpen: false,
  loginModalOpen: false,
  commentModalOpen: false,
  tweetDetails: {
    id: null,
    tweet: null,
    photoUrl: null,
    name: null,
    username: null,
    timestamp: null,
    image: null
  },
  tweetModalOpen: false,
  progressBar: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setSignUpModal: (state, action) => {
      state.signUpModalOpen = action.payload;
    },
    setLoginModal: (state, action) => {
      state.loginModalOpen = action.payload;
    },
    setCommentModal: (state, action) => {
      state.commentModalOpen = action.payload;
    },
    setCommentTweet: (state, action) => {
      (state.tweetDetails.id = action.payload.id),
        (state.tweetDetails.tweet = action.payload.tweet),
        (state.tweetDetails.photoUrl = action.payload.photoUrl),
        (state.tweetDetails.name = action.payload.name),
        (state.tweetDetails.username = action.payload.username);
        (state.tweetDetails.timestamp = action.payload.timestamp);
        (state.tweetDetails.image = action.payload.image);
    },
    setTweetModal: (state, action) => {
      state.tweetModalOpen = action.payload;
    },
    setProgressBar: (state, action) => {
      state.progressBar = action.payload
    }
  },
});

export const {
  setSignUpModal,
  setLoginModal,
  setCommentModal,
  setCommentTweet,
  setTweetModal,
  setProgressBar
} = modalSlice.actions;

export default modalSlice.reducer;
