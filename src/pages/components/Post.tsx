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
    <div className="m-auto mt-10 flex justify-center ">
      <form onSubmit={handleAddPost} className="space-x-2">
        <input
          type="text"
          placeholder="What's on your mind?"
          className="w-96 rounded p-2 drop-shadow-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {sessionData && (
          <button className="rounded bg-white p-2 font-semibold hover:bg-slate-100">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
