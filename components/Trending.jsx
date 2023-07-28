import { DotsHorizontalIcon, SearchIcon } from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import React from "react";

export default function Trending() {
  return (
    <div className="hidden lg:block my-4 mx-7 ">
      <div className="sticky top-4 space-y-4">
        <div className="flex space-x-3 bg-[#16181c] w-[350px] h-[44px] p-3 rounded-3xl ">
          <SearchIcon className="w-6 text-gray-600" />
          <input
            type=""
            placeholder="Search Twitter"
            className="bg-[#16181c] focus:outline-none placeholder:text-gray-600"
          />
        </div>

        <div className="bg-[#16181c] w-[350px] h-auto rounded-2xl">
          <div className="font-bold text-xl p-3">{`What's happening`}</div>
          <TrendingSlice
            top={"Trending in Australia"}
            mid={"Vegemite"}
            bot={"188k Tweets"}
          />
          <TrendingSlice
            top={"Trending in Australia"}
            mid={"Coles and Woolworths"}
            bot={"589k Tweets"}
          />
          <TrendingSlice
            top={"Sports · Trending"}
            mid={"Wenbenyama"}
            bot={"875k Tweets"}
          />
          <TrendingSlice
            top={"Entertainment · Trending"}
            mid={"Barbenheimer"}
            bot={"1M Tweets"}
          />
          <TrendingSlice
            top={"Sports · Trending"}
            mid={"Messi"}
            bot={"357k Tweets"}
          />
          <div className="text-[#1D9BF0] py-3 px-4 hoverTrending rounded-b-2xl">
            Show more
          </div>
        </div>

        <div className="bg-[#16181c] w-[350px] h-auto rounded-2xl justify-between">
          <div className="font-bold text-xl p-3">{`Who to follow`}</div>
          <FollowUser
            name={"LeBron James"}
            tag={"KingJames"}
            pic={"/assets/lebron.jpg"}
          />
          <FollowUser
            name={"Kevin Durant"}
            tag={"KDTrey5"}
            pic={"/assets/kd.jpg"}
          />
          <FollowUser
            name={"Stephen Curry"}
            tag={"StephenCurry30"}
            pic={"/assets/steph.jpg"}
          />
          <div className="text-[#1D9BF0] py-3 px-4 hoverTrending rounded-b-2xl">
            Show more
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUser({ name, tag, pic }) {
  return (
    <div className="flex py-3 px-4 hoverTrending">
      <img
        src={pic}
        alt=""
        className="object-cover w-11 h-11 rounded-full mr-3"
      />
      <div className="flex items-center  justify-between w-full">
        <div>
          <div className="flex items-center space-x-1">
            <div className="font-bold ">{name}</div>
            <BadgeCheckIcon className="w-[18px] text-blue-400" />
          </div>
          <div className="text-gray-500 ">@{tag}</div>
        </div>
        <div className="bg-white text-black px-4 py-1 rounded-full font-bold">
          Follow
        </div>
      </div>
    </div>
  );
}

function TrendingSlice({ top, mid, bot }) {
  return (
    <div className="py-3 px-4 hoverTrending">
      <div className="flex justify-between text-gray-500 text-sm">
        <div>{top}</div>
        <DotsHorizontalIcon className="w-4" />
      </div>
      <div className="font-bold">{mid}</div>
      <div className="text-sm text-gray-500">{bot}</div>
    </div>
  );
}
