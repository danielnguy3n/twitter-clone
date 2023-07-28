import { setLoginModal, setTweetModal } from "@/redux/modalSlice";
import { PencilIcon, XIcon } from "@heroicons/react/outline";
import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TweetInput from "../TweetInput";

export default function TweetModal() {
  const dispatch = useDispatch();
  const openTweetModal = useSelector((state) => state.modals.tweetModalOpen);
  const progress = useSelector((state) => state.modals.progressBar);
  const user = useSelector((state) => state.user);

  function handleOpen() {
    user.uid ? dispatch(setTweetModal(true)) : dispatch(setLoginModal(true));
  }

  function handleClose() {
    dispatch(setTweetModal(false));
  }

  return (
    <>
      <div className="my-4 px-3 flex w-full justify-center">
        <button
          className="bg-[#1D9BF0] p-3 rounded-full font-bold xl:w-[90%] xl:py-3"
          onClick={() => handleOpen()}
        >
          <span className="hidden xl:inline">Tweet</span>
          <PencilIcon className="h-6 xl:hidden" />
        </button>
      </div>
      <Modal
        open={openTweetModal}
        onClose={handleClose}
        className="relative bg-white/20 z-0 "
      >
        <div className="positionCommentModal bg-black border border-black text-white w-full h-full sm:w-[600px] sm:h-auto rounded-2xl relative overflow-hidden">
          <div
            className={`absolute top-0 left-0
          w-[${progress}%] transition-[width] duration-200 ease-linear bg-[#1D9BF0] h-1`}
          ></div>
          <div className="p-4">
            <XIcon
              className="w-6 cursor-pointer"
              onClick={() => handleClose()}
            />
          </div>
          <TweetInput modal={true} />
        </div>
      </Modal>
    </>
  );
}
