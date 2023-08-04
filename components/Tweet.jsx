import {
  setCommentModal,
  setCommentTweet,
  setLoginModal,
} from "@/redux/modalSlice";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import DropdownMenu from "./DropdownMenu";

export default function Tweet({ data, id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  function handleClick() {
    dispatch(
      setCommentTweet({
        id: id,
        tweet: data.tweet,
        photoUrl: data.photoUrl,
        name: data.name,
        username: data.username,
        timestamp: data.timestamp.seconds,
        image: data.image || null,
      })
    );
    router.push(id);
  }

  function handleComment(e) {
    e.stopPropagation();
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
        image: data.image || null,
      })
    );
    dispatch(setCommentModal(true));
  }

  async function likeComment(e) {
    e.stopPropagation();

    if (!user.uid) {
      dispatch(setLoginModal(true));
      return;
    }

    if (likes.includes(user.uid)) {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayUnion(user.uid),
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "posts", id), (snapshot) => {
      setLikes(snapshot.data()?.likes);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "replies"),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <div
      className="border-t border-gray-700 cursor-pointer"
      onClick={() => handleClick()}
    >
      <TweetHeader data={data} id={id} />
      <div className="py-3 px-3 ml-14 text-gray-500 flex justify-between">
        <div
          className="flex space-x-2 items-center"
          onClick={(e) => handleComment(e)}
        >
          <ChatIcon className="w-5 cursor-pointer hover:text-sky-500 transition-colors ease-linear duration-200" />
          {comments.length > 0 && (
            <div className="text-gray-500 text-xs"> {comments.length} </div>
          )}
        </div>
        <RetweetIcon />
        <div
          className="flex space-x-2 items-center hover:text-pink-500"
          onClick={(e) => likeComment(e)}
        >
          {likes.includes(user.uid) ? (
            <FilledHeartIcon className="w-5 cursor-pointer text-pink-500 transition-colors ease-linear duration-200" />
          ) : (
            <HeartIcon className="w-5 cursor-pointer transition-colors ease-linear duration-200" />
          )}
          <div
            className={`${
              likes.includes(user.uid) ? `text-pink-500` : `text-gray-500`
            } text-xs font-thin`}
          >
            {likes.length > 0 && likes.length}
          </div>
        </div>
        <ChartBarIcon className="w-5 cursor-not-allowed " />
        <UploadIcon className="w-5 cursor-not-allowed " />
      </div>
    </div>
  );
}

export function TweetHeader({ data, id, reply }) {
  const moment = require("moment");
  const user = useSelector((state) => state.user);

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
    if (!timestamp) {
      return "Now";
    }
    const postDate = moment.unix(timestamp).date();
    const currentDate = moment().date();
    const diff = postDate -  currentDate;

    const formattedDate = moment.unix(timestamp).format("MMM D");
    const fromNow = moment.unix(timestamp).fromNow();

    if (diff > 0) {
      return formattedDate;
    }

    return fromNow;
  }

  return (
    <div className="flex space-x-3 px-3 pt-3 w-full ">
      <img
        src={data?.photoUrl}
        alt=""
        className="w-11 h-11 object-cover rounded-full"
      />

      <div className="w-full">
        <div className="flex justify-between items-center -mt-1.5 mb-1">
          <div className="flex items-center space-x-1.5">
            <div className="font-bold">{data?.name}</div>
            <div className="text-gray-500">@{data?.username}</div>
            <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
            <div className="text-gray-500">
              {formatTimestamp(data?.timestamp?.seconds)}
            </div>
          </div>
          {data.uid === user.uid && (
            <div className="rounded-full text-gray-500 hover:text-[#1D9Bf0] hover:bg-[#1D9Bf0] hover:bg-opacity-20">
              <DropdownMenu id={id} reply={reply} />
            </div>
          )}
        </div>
        <span>{data?.tweet}</span>
        {data?.image && (
          <img
            className="rounded-lg max-h-80 mt-3 border border-gray-700"
            src={data?.image}
            alt=""
          />
        )}
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
      className="w-5 h-5 cursor-pointer hover:text-green-500 transition-colors ease-linear duration-200"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
      />
    </svg>
  );
}
