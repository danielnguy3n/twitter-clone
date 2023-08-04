import { setCommentModal, setCommentTweet } from "@/redux/modalSlice";
import { Modal } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TweetInput from "../TweetInput";
import { XIcon } from "@heroicons/react/outline";

export default function CommentModal() {
  const dispatch = useDispatch();
  const tweetReply = useSelector((state) => state.modals.tweetDetails);
  const moment = require("moment");

  const openCommentModal = useSelector(
    (state) => state.modals.commentModalOpen
  );

  const data = useSelector((state) => state.modals.tweetDetails);

  moment.updateLocale("en", {
    relativeTime: {
      past: "%s",
      s: "1s",
      ss: "%ds",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
    },
  });

  function formatTimestamp(timestamp) {
    const postDate = moment.unix(timestamp).date();
    const currentDate = moment().date();
    const diff = postDate -  currentDate

    const formattedDate = moment.unix(timestamp).format("MMM D");
    const fromNow = moment.unix(timestamp).fromNow();

    if (diff > 0) {
      return formattedDate;
    }

    return fromNow;
  }

  const user = useSelector((state) => state.user);
  const progress = useSelector((state) => state.modals.progressBar);

  function handleClose() {
    dispatch(setCommentModal(false));
  }

  return (
    <>
      <Modal
        open={openCommentModal}
        onClose={handleClose}
        className="relative bg-white bg-opacity-20"
      >
        <div className="positionCommentModal bg-black border border-black text-white w-full h-full sm:w-[600px] sm:h-auto rounded-2xl relative overflow-hidden outline-none">
          <div
            className={`absolute top-0 left-0
          w-[${progress}%] transition-[width] duration-200 ease bg-[#1D9BF0] h-1`}
          ></div>
          <div className="p-4">
            <XIcon
              className="w-6 cursor-pointer"
              onClick={() => handleClose()}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex p-4">
              <div className="flex flex-col w-auto">
                <img
                  src={data?.photoUrl}
                  alt=""
                  className="w-11 h-11 object-cover rounded-full relative"
                />
                <div className="mx-auto w-0.5 flex-grow bg-gray-500 relative">
                  <div className="w-0.5 h-8 bg-gray-500 absolute -bottom-8"></div>
                </div>
              </div>

              <div className="ml-3 w-[90%]">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="font-bold">{data?.name}</div>
                  <div className="text-gray-500">@{data?.username}</div>
                  <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
                  <div className="text-gray-500">
                    {formatTimestamp(data.timestamp)}
                  </div>
                </div>
                <span>{data?.tweet}</span>
                <div>
                  <img
                    className="rounded-lg max-h-80 "
                    src={data?.image}
                    alt=""
                  />
                </div>
                <div className="mt-2 text-gray-500">
                  Replying to
                  <span className="text-[#1b9bf0]"> @{data?.username}</span>
                </div>
              </div>
            </div>

            <div className="p-1">
              <TweetInput reply={true} modal={true}/>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
