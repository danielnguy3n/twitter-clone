import React, { useEffect, useState } from "react";
import TweetInput from "./TweetInput";
import Tweet from "./Tweet";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import CommentModal from "./modals/CommentModal";
import Link from "next/link";
import { useSelector } from "react-redux";
import Spinner from "./UI/Spinner";

export default function PostFeed() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTweets(snapshot.docs);
    });
    setTimeout(() => setLoading(false), 1000);
    return unsubscribe;
  }, []);

  return (
    <div className="sm:ml-20 xl:ml-[275px] max-w-[600px] flex-grow border-gray-700 border-x relative">
      <div className="px-4 py-2 text-lg font-bold border-b border-gray-700 sticky top-0 z-50 bg-black bg-opacity-80">
        Home
      </div>
      <TweetInput reply={false} />
      {loading ? (
        <div className="border-t border-gray-700 absolute bg-black h-screen w-full ">
          <div className="absolute top-60 left-1/2 -translate-x-1/2">
            <Spinner />
          </div>
        </div>
      ) : (
        <div className={`border-b border-gray-700`}>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} id={tweet.id} data={tweet.data()} />
          ))}
        </div>
      )}

      <CommentModal />
    </div>
  );
}
