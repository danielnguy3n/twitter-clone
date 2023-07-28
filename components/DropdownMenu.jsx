import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { DotsHorizontalIcon, TrashIcon } from "@heroicons/react/outline";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";

export default function DropdownMenu({ id, reply }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();

    console.log(reply);

    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  async function handleDelete() {
    if (reply) {
      const postId = router.query.id;
      await deleteDoc(doc(db, "posts", router.query.id, "replies", id));
    } else {
      await deleteDoc(doc(db, "posts", id));
      if (router.pathname === "/[id]") {
        router.push("/");
      }
    }
  }

  return (
    <>
      <DotsHorizontalIcon
        className="w-5"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiList-padding": {
            padding: "0px",
          },
          "& .MuiPaper-root": {
            background: "transparent",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose}>
          <div
            className="flex space-x-2 bg-black text-[#F4212E] font-bold text-xs items-center"
            onClick={() => handleDelete()}
          >
            <TrashIcon className="w-4" />
            <div>Delete</div>
          </div>
        </MenuItem>
      </Menu>
    </>
  );
}
