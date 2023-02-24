import { api } from "~/utils/api";

export default function Posts() {
  const posts = api.post.getAllPost.useQuery();

  return (
    <div className="m-auto mt-10 w-1/2">
      {posts.data
        ? posts.data.map((t) => (
            <div className="flex flex-col gap-6 bg-white">
              <h1>{t.userId}</h1>
              <h3>{t.message}</h3>
            </div>
          ))
        : ""}
    </div>
  );
}
