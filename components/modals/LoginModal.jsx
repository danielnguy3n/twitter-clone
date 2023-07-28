import { auth } from "@/firebase";
import { setLoginModal } from "@/redux/modalSlice";
import { Modal } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../UI/Spinner";

export default function LoginModal() {
  const dispatch = useDispatch();
  const openLoginModal = useSelector((state) => state.modals.loginModalOpen);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  function handleClose() {
    dispatch(setLoginModal(false));
    setError(null)
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      handleClose();
    } catch (e) {
      const errorCode = e.code.split("/")[1];
      const errorMessage = errorCode[0].toUpperCase() + errorCode.slice(1);
      const formatError = errorMessage.split("-").join(" ");
      setLoading(false);
      setError(formatError);
    }
  }

  async function handleGuestSignIn() {
    setLoading(true);
    await signInWithEmailAndPassword(auth, "guest@gmail.com", "test123");
    handleClose();
  }

  return (
    <>
      <button
        className="bg-[#1d9bf0] border border-white/50 font-bold text-white w-[100%] h-9 md:w-fit rounded-full hover:bg-[#20a6ff] transition-all duration-200"
        onClick={() => dispatch(setLoginModal(true))}
      >
        <div className="px-4">Log in</div>
      </button>
      <div className="flex justify-center items-center">
        <Modal
          open={openLoginModal}
          onClose={handleClose}
          className="flex justify-center items-center"
        >
          <div className=" w-[90%] md:w-[560px] h-auto bg-black border border-gray-700 rounded-lg text-white flex justify-center outline-none">
            {loading && (
              <div className="h-[426px] flex justify-center items-center">
                <Spinner />
              </div>
            )}
            {!loading && (
              <>
                <div className="w-[90%] flex flex-col">
                  <div className="text-4xl font-bold my-8">
                    Sign in to your account
                  </div>
                  <form
                    onSubmit={(e) => handleSignIn(e)}
                    className="flex flex-col space-y-6"
                  >
                    <input
                      className="inputField"
                      type="text"
                      placeholder="Email"
                      required={true}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="inputField"
                      type="password"
                      placeholder="Password"
                      required={true}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="text-black bg-white w-full font-bold mt-8 h-10 text-lg rounded-md"
                    >
                      Sign In
                    </button>
                  </form>
                  <div className="my-4 text-center font-bold text-lg">or</div>
                  <button
                    className="text-black bg-white w-full font-bold h-10 text-lg rounded-md mb-8"
                    onClick={() => handleGuestSignIn()}
                  >
                    Sign in as Guest
                  </button>
                </div>
                {error && (
                  <div className="bg-[#1d9bf0] font-bold p-2 rounded-lg absolute bottom-20 md:bottom-24">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}
