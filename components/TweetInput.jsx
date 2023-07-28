import { db, storage } from "@/firebase";
import {
  setCommentModal,
  setLoginModal,
  setProgressBar,
  setTweetModal,
} from "@/redux/modalSlice";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TweetInput({ reply, modal }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const tweetReply = useSelector((state) => state.modals.tweetDetails);
  const router = useRouter();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const filePickerRef = useRef();

  const [progress, setProgress] = useState(0);
  const [sendingTweet, setSendingTweet] = useState(false);

  useEffect(() => {
    if (progress < 100 && sendingTweet) {
      setTimeout(() => setProgress((prev) => (prev += 10)), 10);
    }

    if (!sendingTweet) {
      setProgress(0);
    }

    if (modal) {
      dispatch(setProgressBar(progress));
    }
  }, [progress, sendingTweet]);

  async function sendTweet() {
    setSendingTweet(true);
    const tweetDetails = {
      username: user.username,
      name: user.name,
      photoUrl: user.photoUrl,
      uid: user.uid,
      timestamp: serverTimestamp(),
      likes: [],
      tweet: text,
    };

    if (reply) {
      const docRef = await addDoc(
        collection(db, "posts", tweetReply.id, "replies"),
        tweetDetails
      );

      if (image) {
        const imageRef = ref(storage, `tweetImages/${docRef.id}`);
        const uploadImage = await uploadString(imageRef, image, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(docRef, {
          image: downloadURL,
        });
      }

      if (router.pathname !== "/[id]") {
        router.push("/" + tweetReply.id);
      }
    } else {
      const docRef = await addDoc(collection(db, "posts"), tweetDetails);

      if (image) {
        const imageRef = ref(storage, `tweetImages/${docRef.id}`);
        const uploadImage = await uploadString(imageRef, image, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(docRef, {
          image: downloadURL,
        });
      }
    }

    setSendingTweet(false);
    dispatch(setProgressBar(0));
    dispatch(setCommentModal(false));
    dispatch(setTweetModal(false));
    setText("");
    setImage(null);
  }

  function addImagetoTweet(e) {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.addEventListener("load", (e) => {
      setImage(e.target.result);
    });
  }

  function deleteImage() {
    setImage(null);
    filePickerRef.current.value = "";
  }

  function handleClick() {
    user.uid ? filePickerRef.current.click() : dispatch(setLoginModal(true))
  }

  return (
    <div className="flex flex-col relative overflow-hidden">
      {!modal && sendingTweet && (
        <div
          className={`absolute top-0 left-0
          w-[${progress}%] transition-[width] duration-200 ease-linear bg-[#1D9BF0] h-1`}
        ></div>
      )}

      <div className="flex p-3 ">
        <img
          src={user.photoUrl || "/assets/emptypfp.png"}
          className="w-11 h-11 object-cover rounded-full"
        />

        <div className="w-full ml-3">
          <textarea
            value={text}
            name=""
            id=""
            className="bg-transparent resize-none outline-none w-full min-h-[50px] text-lg"
            placeholder={reply ? "Tweet your reply!" : "What's on your mind?"}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {image && (
            <div className="relative mb-4 w-fit">
              <div
                onClick={() => deleteImage()}
                className="absolute right-1 top-1 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
              >
                <XIcon className="w-4" />
              </div>
              <img
                className="rounded-2xl max-h-80 object-contain"
                src={image}
                alt="uploaded pic"
              />
            </div>
          )}

          <div className="flex justify-between border-t border-gray-700 pt-4">
            <div className="flex">
              <div
                className="iconsAnimation hover:cursor-pointer"
                onClick={() => handleClick()}
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
              </div>
              <input
                ref={filePickerRef}
                onChange={addImagetoTweet}
                className="hidden"
                type="file"
              />
              <div className="iconsAnimation">
                <ChartBarIcon className="h-[22px] text-[#1d9bf0]" />
              </div>
              <div className="iconsAnimation">
                <EmojiHappyIcon className="h-[22px] text-[#1d9bf0]" />
              </div>
              <div className="iconsAnimation">
                <CalendarIcon className="h-[22px] text-[#1d9bf0]" />
              </div>
              <div className="iconsAnimation">
                <LocationMarkerIcon className="h-[22px] text-[#1d9bf0]" />
              </div>
            </div>
            <button
              className="bg-[#1D9BF0] rounded-full font-bold px-4 py-1.5 disabled:opacity-70"
              onClick={() => sendTweet()}
              disabled={(!text && !image) || !user.uid}
            >
              {reply ? "Reply" : "Tweet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
