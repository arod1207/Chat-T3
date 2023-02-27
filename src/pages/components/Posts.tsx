import { api } from "~/utils/api";
import Moment from "react-moment";
import RingLoader from "react-spinners/RingLoader";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function Posts() {
  const { data: sessionData } = useSession();

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    api.post.getAllPost.useInfiniteQuery(
      { limit: 10 },
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
      }
    );

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const utils = api.useContext();

  const { mutate: likeMutation } = api.post.likePost.useMutation({
    onSuccess() {
      toast("Post Liked", {
        icon: "🔥",
        duration: 2000,
        style: {
          background: "#A855F7",
          color: "#000",
          fontWeight: "bold",
        },
      });
      utils.invalidate();
    },
  });
  const { mutate: unlikeMutation } = api.post.unlikePost.useMutation({
    onSuccess() {
      utils.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <RingLoader color="#ffffff" />
      </div>
    );
  }

  return (
    <div className="mx-2">
      {posts.flatMap((t) => (
        <div
          key={t.id}
          className="relative m-auto mt-6 flex h-32 w-full items-center gap-2 rounded-md bg-white px-6 shadow-md md:w-1/2"
        >
          <div className="flex space-x-2">
            <img
              src={t.author.image || undefined}
              alt="users image"
              height={42}
              width={42}
              className="rounded-full object-contain"
            />
            <div>
              <div className="flex space-x-2">
                <h3 className="text-sm font-semibold">{t.author.name}</h3>{" "}
                <h3 className="text-sm font-semibold text-gray-400">
                  {" "}
                  ~<Moment fromNow>{t.createdAt}</Moment>
                </h3>
              </div>
              <p>{t.message}</p>
            </div>
          </div>
          <div
            className={
              sessionData
                ? "absolute bottom-2 right-4 cursor-pointer"
                : "absolute bottom-2 right-4 cursor-default"
            }
            onClick={() => {
              if (t.likes.length > 0) {
                unlikeMutation({ likeId: t.id });
                return;
              }
              likeMutation({ likeId: t.id });
            }}
          >
            💝 <span className="text-sm font-semibold">{t._count.likes}</span>
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
    </div>
  );
}
