import { Modal } from "@mui/material";
import React, { useState } from "react";
import SignUpModal from "./modals/SignUpModal";
import LoginModal from "./modals/LoginModal";

export default function BottomBanner() {
  return (
    <div className="fixed flex w-full h-fit bottom-0 bg-[#1d9bf0]  justify-center  text-white">
      <div className="flex items-center w-full justify-center md:justify-between md:w-[600px] lg:w-[990px]">
        <div className="hidden md:inline my-2.5 lg:pl-16">
          <div className="text-2xl font-bold">{`Don't miss what's happening`}</div>
          <div className="text-[15px] ">
            People on Twitter are the first to know
          </div>
        </div>
        <div className="w-full md:w-fit px-4 flex items-center space-x-1 lg:pr-4 my-2.5">
          <LoginModal />
          <SignUpModal />
        </div>
      </div>
    </div>
  );
}
