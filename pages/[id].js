import BottomBanner from "@/components/BottomBanner";
import PostFeed from "@/components/PostFeed";
import Reply from "@/components/Reply";
import ReplyFeed from "@/components/ReplyFeed";
import Sidebar from "@/components/Sidebar";
import Trending from "@/components/Trending";
import TweetInput from "@/components/TweetInput";
import TweetReplyHeader from "@/components/TweetReplyHeader";
import Spinner from "@/components/UI/Spinner";
import { db } from "@/firebase";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function TweetPage() {
  const user = useSelector((state) => state.user);
  const [replies, setReplies] = useState([]);
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setPost(snapshot.data());
    });

    return unsubscribe;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, "posts", id, "replies"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs);
    });

    setTimeout(() => setLoading(false), 1000);
    return unsubscribe;
  }, [id]);

  return (
    <>
      <div className="bg-black min-h-screen text-[#e7e9ea] max-w-[1400px] mx-auto flex">
        <Sidebar />

        <div className="sm:ml-20 xl:ml-[275px] max-w-2xl flex-grow border-gray-700 border-x relative">
          <div className="px-4 py-2 text-lg font-bold border-b border-gray-700 sticky top-0 z-50 flex bg-black bg-opacity-80">
            <ArrowLeftIcon
              className="w-5 mr-6 cursor-pointer"
              onClick={() => router.push("/")}
            />
            Tweet
          </div>
          {loading ? (
            <div className="absolute bg-black h-screen w-full ">
              <div className="absolute top-60 left-1/2 -translate-x-1/2">
                <Spinner />
              </div>
            </div>
          ) : (
            <>
              <TweetReplyHeader id={id} data={post} />
              <TweetInput reply={true} />
              <div className="border-b border-gray-700">
                {replies.map((reply) => (
                  <Reply key={reply.id} id={reply.id} data={reply.data()} />
                ))}
              </div>
            </>
          )}
        </div>

        <Trending />
      </div>
      {!user.uid && <BottomBanner />}
    </>
  );
}
