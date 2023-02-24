import { api } from "~/utils/api";

export default function Posts() {
  const posts = api.post.getAllPost.useQuery();

  return (
    <>
      {posts.data
        ? posts.data.map((t) => (
            <div
              key={t.id}
              className="m-auto my-5 flex w-1/2 flex-col gap-3 bg-white px-2"
            >
              <h1>{t.id}</h1>
              <h3>{t.message}</h3>
              <div className="flex h-6 items-center border-t-2">
                <h5 className="text-xs font-semibold">Comment</h5>
              </div>
            </div>
          ))
        : ""}
    </>
  );
}
