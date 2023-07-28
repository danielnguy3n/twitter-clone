import {
  setCommentModal,
  setCommentTweet,
  setLoginModal,
} from "@/redux/modalSlice";
import {
  BookmarkIcon,
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentModal from "./modals/CommentModal";
import DropdownMenu from "./DropdownMenu";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function TweetReplyHeader({ data, id }) {
  const dispatch = useDispatch();
  const moment = require("moment");
  const formatTimestamp = moment(data?.timestamp.toDate()).format(
    "h:mm A · MMM DD, YYYY "
  );
  const user = useSelector((state) => state.user);

  async function likeComment(e) {
    if (!user.uid) {
      dispatch(setLoginModal(true));
      return;
    }

    if (data?.likes.includes(user.uid)) {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayUnion(user.uid),
      });
    }
  }

  function handleComment() {
    if (!user.uid) {
      dispatch(setLoginModal(true));
      return;
    }
    dispatch(
      setCommentTweet({
        id: id,
        tweet: data.tweet,
        photoUrl: data.photoUrl,
        name: data.name,
        username: data.username,
        timestamp: data.timestamp.seconds,
      })
    );
    dispatch(setCommentModal(true));
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex space-x-3 items-center w-full">
        <img
          src={data?.photoUrl}
          alt=""
          className="w-11 h-11 object-cover rounded-full"
        />
        <div className="flex w-full justify-between">
          <div>
            <div className="font-bold">{data?.name}</div>
            <div className="text-gray-500">@{data?.username}</div>
          </div>
          <div>
            {data?.uid === user.uid && (
              <div className="cursor-pointer rounded-full text-gray-500 hover:text-[#1D9Bf0] hover:bg-[#1D9Bf0] hover:bg-opacity-20">
                <DropdownMenu id={id} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-[17px] mt-3">{data?.tweet}</div>
      {data?.image && (
        <img
          className="rounded-lg w-full border border-gray-700 "
          src={data?.image}
          alt=""
        />
      )}

      <div className="flex my-4 items-center space-x-2">
        <div className="text-gray-500">{formatTimestamp}</div>
      </div>

      {data?.likes.length > 0 && (
        <div className="space-x-1 py-2 border-t border-gray-700">
          <span className="font-bold">{data?.likes.length}</span>
          <span className="text-gray-500">
            {data?.likes.length > 1 ? "Likes" : "Like"}
          </span>
        </div>
      )}

      <CommentModal />

      <div className="flex w-full justify-around text-gray-500 py-3 border-y border-gray-700">
        <div onClick={() => handleComment()}>
          <ChatIcon className="w-6 cursor-pointer hover:text-sky-500 transition-colors ease-linear duration-200" />
        </div>
        <RetweetIcon />
        <div onClick={likeComment}>
          {data?.likes.includes(user.uid) ? (
            <FilledHeartIcon className="w-6 cursor-pointer text-pink-500 transition-colors ease-linear duration-200" />
          ) : (
            <HeartIcon className="w-6 cursor-pointer hover:text-pink-500 transition-colors ease-linear duration-200" />
          )}
        </div>
        <BookmarkIcon className="w-6 cursor-not-allowed " />
        <UploadIcon className="w-6 cursor-not-allowed " />
      </div>
    </div>
  );
}

export function RetweetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 cursor-pointer hover:text-green-500 transition-colors ease-linear duration-200"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
      />
    </svg>
  );
}
