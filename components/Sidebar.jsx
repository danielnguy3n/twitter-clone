import React from "react";
import {
  HomeIcon,
  HashtagIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  BellIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import { HomeIcon as FilledHomeIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Logo from "../public/assets/twitter-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { signOutUser } from "@/redux/userSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import TweetModal from "./modals/TweetModal";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
  }

  return (
    <div className="hidden sm:flex sm:w-20 flex-col fixed justify-between h-screen xl:w-[275px] xl:pl-4 xl:px-2">
      <div className=" flex flex-col items-center xl:items-start">
        <Link href={"/"}>
          <div className="flex justify-start items-center p-3 min-h-[52px] min-w-[52px]">
            <Image src={Logo} width={34} height={34} alt="profilepic" />
          </div>
        </Link>
        <nav className="flex flex-col items-start ">
          <Link href={"/"}>
            {router.pathname === "/" ? (
              <SidebarLink Icon={FilledHomeIcon} title={"Home"} />
            ) : (
              <SidebarLink Icon={HomeIcon} title={"Home"} />
            )}
          </Link>

          <SidebarLink Icon={HashtagIcon} title={"Explore"} />
          <SidebarLink Icon={BellIcon} title={"Notifications"} />
          <SidebarLink Icon={InboxIcon} title={"Messages"} />
          <SidebarLink Icon={BookmarkIcon} title={"Bookmarks"} />
          <SidebarLink Icon={ClipboardListIcon} title={"Lists"} />
          <SidebarLink Icon={UserIcon} title={"Profile"} />
          <SidebarLink Icon={DotsCircleHorizontalIcon} title={"More"} />
        </nav>
        <TweetModal />
        
      </div>

      <div
        className={`hoverAnimation xl:flex xl:space-x-4 p-3 my-3 items-center ${!user?.uid && `hidden`}`}
        onClick={() => handleSignOut()}
      >
        <div className="flex justify-center">
          <img
            src={user.photoUrl || "/assets/profilePictures/pfp2.png"}
            alt=""
            className="w-11 h-11 rounded-full object-cover"
          />
        </div>
        <div className="hidden justify-center xl:flex xl:justify-between items-center w-[70%] ">
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-gray-500">@{user.username}</div>
          </div>
          <div className="items-end">
            <DotsHorizontalIcon className="w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ Icon, title }) {
  return (
    <li className="flex justify-center xl:justify-start items-center p-3 hoverAnimation">
      <Icon className="h-7 w-7 items-center" />
      <span className="hidden xl:inline xl:mx-3 text-xl">{title}</span>
    </li>
  );
}

export default Sidebar;
