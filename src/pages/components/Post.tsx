import { useSession } from "next-auth/react";
import { useState } from "react";
import { FormEvent } from "react";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

export default function Post() {
  const [text, setText] = useState("");

  const utils = api.useContext();
  const { data: sessionData } = useSession();

  const { mutate: addPostMutate } = api.post.addPost.useMutation({
    onError(err) {
      const errorMessage = JSON.parse(err.message);
      toast(errorMessage[0].message, {
        icon: "❌",
        duration: 2000,
        style: {
          background: "#ffffff",
          color: "#000",
          fontWeight: "bold",
        },
      });
    },
    onSuccess() {
      utils.post.invalidate();
      toast("Post Added", {
        icon: "🔥",
        duration: 2000,
        style: {
          background: "#A855F7",
          color: "#000",
          fontWeight: "bold",
        },
      });
      setText("");
    },
  });

  //Add Post//
  const handleAddPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPostMutate(text);
  };

  return (
    <div className="mt-10 px-2">
      {sessionData ? (
        <div className="relative  flex h-32 w-full items-center justify-center  rounded-md bg-purple-700  shadow-md md:m-auto md:w-1/2">
          <form
            onSubmit={handleAddPost}
            className="mx-6 flex w-full justify-center space-x-2"
          >
            <input
              type="text"
              placeholder="What's on your mind?"
              className="w-full rounded p-2 drop-shadow-lg"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="rounded bg-white p-2 font-semibold hover:bg-slate-100">
              Submit
            </button>
          </form>
          <div className="absolute bottom-5 left-7">
            <h3
              className={`${
                text.length > 150
                  ? "text-sm font-semibold text-red-600"
                  : "text-sm font-semibold text-white"
              }`}
            >
              {text.length}/150
            </h3>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <h1 className="text-center text-4xl font-bold text-white">
            SIGN IN TO POST A MESSAGE
          </h1>
        </div>
      )}
    </div>
  );
}
