import { useState } from "react";
import { FormEvent } from "react";

import { api } from "~/utils/api";

export default function Post() {
  const [text, setText] = useState("");

  const { mutate: addPostMutate } = api.post.addPost.useMutation();

  //Add Post//
  const handleAddPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPostMutate(text);
  };

  return (
    <div className="m-auto mt-10 flex w-full justify-center ">
      <form onSubmit={handleAddPost} className="space-x-2">
        <input
          type="text"
          placeholder="What's on your mind?"
          className="w-96 rounded p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="rounded bg-white p-2 font-semibold">Submit</button>
      </form>
    </div>
  );
}
