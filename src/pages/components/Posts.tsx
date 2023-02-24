import { api } from "~/utils/api";
import Moment from "react-moment";

export default function Posts() {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.post.getAllPost.useInfiniteQuery(
      { limit: 5 },
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
      }
    );

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      {posts.flatMap((t) => (
        <div
          key={t.id}
          className="m-auto mt-6  w-1/2 gap-2 rounded-md bg-white px-6 shadow-md"
        >
          <div className="flex items-center  space-x-2 p-2">
            <img
              src={t.author.image || undefined}
              alt="users image"
              height={42}
              width={42}
              className="rounded-full object-contain"
            />
            <div>
              <h5 className="text-xs font-semibold text-gray-500">
                {t.author.name}
              </h5>
              <h6 className="text-xs font-semibold text-gray-500">
                <Moment fromNow>{t.createdAt}</Moment>
              </h6>
            </div>
          </div>
          <div className="min-h-10 mt-2 border-b-2">
            <p>{t.message}</p>
          </div>
          <div className="flex  h-6 items-center">
            <h5 className="cursor-pointer text-xs font-semibold">Comments</h5>
          </div>
        </div>
      ))}
      <div className="m-5 flex justify-center">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
          className={`${
            !hasNextPage || isFetching
              ? "rounded-md bg-gray-500 py-2 px-4 font-semibold text-white"
              : "rounded-md bg-white py-2 px-4 font-semibold text-purple-600"
          }`}
        >
          Load More Posts
        </button>
      </div>
    </>
  );
}
