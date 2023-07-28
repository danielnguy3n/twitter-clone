import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";
import { TweetHeader } from "./Tweet";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLoginModal } from "@/redux/modalSlice";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function Reply({ data, id }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState([]);
  const router = useRouter();
  const postId = router.query.id;

  async function likeComment(e) {
    if (!postId) return;
    e.stopPropagation();

    if (!user.uid) {
      dispatch(setLoginModal(true));
      return;
    }

    if (likes.includes(user.uid)) {
      await updateDoc(doc(db, "posts", postId, "replies", id), {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(doc(db, "posts", postId, "replies", id), {
        likes: arrayUnion(user.uid),
      });
    }
  }

  useEffect(() => {
    if (!postId) return;
    const unsubscribe = onSnapshot(
      doc(db, "posts", postId, "replies", id),
      (snapshot) => {
        setLikes(snapshot.data()?.likes);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <div className="border-t border-gray-700">
      <TweetHeader id={id} data={data} reply={true} />
      <div className="py-3 px-5 ml-12 text-gray-500 flex justify-between space-x-14">
        <ChatIcon className="w-5 cursor-not-allowed hover:text-sky-500 transition-colors ease-linear duration-200" />
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
