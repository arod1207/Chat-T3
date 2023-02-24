import { api, RouterOutputs } from "~/utils/api";

export default function Posts() {
  const posts = api.post.getAllPost.useQuery();

  console.log(posts);

  return (
    <>
      {posts.data
        ? posts.data.map((t) => (
            <div
              key={t.id}
              className="m-auto mt-6  w-1/2 gap-2 rounded-md bg-white px-6 shadow-md"
            >
              <div className="flex items-center  space-x-2 p-2">
                <img
                  src={t.author.image || undefined}
                  alt="users image"
                  height={48}
                  width={48}
                  className="rounded-full object-contain"
                />
                <h5 className="text-sm font-semibold">{t.author.name}</h5>
              </div>
              <div className="min-h-10 mt-2 border-b-2">
                <p>{t.message}</p>
              </div>
              <div className="flex  h-6 items-center">
                <h5 className="cursor-pointer text-xs font-semibold">
                  Comments
                </h5>
              </div>
            </div>
          ))
        : "No Post Added"}
    </>
  );
}
