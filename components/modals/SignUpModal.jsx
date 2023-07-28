import { auth } from "@/firebase";
import { setSignUpModal } from "@/redux/modalSlice";
import { setUser } from "@/redux/userSlice";
import { Modal } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../UI/Spinner";

export default function SignUpModal() {
  const dispatch = useDispatch();
  const openSignUpModal = useSelector((state) => state.modals.signUpModalOpen);
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function handleClose() {
    dispatch(setSignUpModal(false));
    setError(null)
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: `./assets/profilePictures/pfp${Math.ceil(
          Math.random() * 6
        )}.png`,
      });
      router.reload();
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      dispatch(
        setUser({
          username: user.email.split("@")[0],
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoUrl: user.photoURL,
        })
      );
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <button
        className="bg-white border border-white w-[100%] md:w-fit h-9 rounded-full hover:bg-gray-200 transition-colors duration-200"
        onClick={() => dispatch(setSignUpModal(true))}
      >
        <span className=" font-bold text-black px-4">Sign Up</span>
      </button>
      <div className="flex justify-center items-center">
        <Modal
          open={openSignUpModal}
          onClose={handleClose}
          className="flex justify-center items-center"
        >
          <div className=" w-[90%] md:w-[560px] h-auto bg-black border border-gray-700 rounded-lg text-white flex justify-center">
            {loading && (
              <div className="h-[492px] flex justify-center items-center">
                <Spinner />
              </div>
            )}
            {!loading && (
              <>
                <div className="w-[90%] flex flex-col">
                  <button
                    className="text-black bg-white w-full font-bold mt-8 h-10 text-lg rounded-md"
                    onClick={() => handleGuestSignIn()}
                  >
                    Sign in as Guest
                  </button>
                  <div className="my-4 text-center font-bold text-lg">or</div>
                  <div className="text-4xl font-bold mb-6">
                    Create your account
                  </div>

                  <form
                    onSubmit={(e) => handleSignUp(e)}
                    className="flex flex-col space-y-6 mb-8"
                  >
                    <input
                      className="inputField"
                      type="text"
                      placeholder="Full Name"
                      required={true}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="inputField"
                      type="email"
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
                      Create Account
                    </button>
                  </form>
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
