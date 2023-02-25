import { CloseSVG, TrashCanSVG } from "../../lib/SVGs";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

type modalProps = {
  setShow: (show: boolean) => void;
  show: boolean;
};

export default function Modal({ setShow }: modalProps) {
  const { data } = api.post.getUserPost.useQuery();

  const utils = api.useContext();

  const { mutate: deletePostMutation } = api.post.deleteUserPost.useMutation({
    onSuccess() {
      utils.post.invalidate();
      toast("Post Deleted", {
        icon: "🗑 ",
        duration: 2000,
        style: {
          background: "#A855F7",
          color: "#000",
          fontWeight: "bold",
        },
      });
    },
  });

  const handleDeletePost = (id: string) => {
    deletePostMutation(id);
  };

  return (
    <div className="absolute inset-0 z-20 flex h-screen items-center justify-center bg-black opacity-90">
      <div className="relative w-1/2 bg-white">
        <div
          className="absolute -top-3 -right-3  cursor-pointer font-bold text-red-600"
          onClick={() => setShow(false)}
        >
          <CloseSVG />
        </div>
        <div>
          <h1 className="text-center text-lg font-semibold text-black">
            Your Post
          </h1>
        </div>
        <div className="space-x-2">
          {data?.map((t) => (
            <div key={t.id} className="flex justify-between py-2 px-2">
              <p>{t.message}</p>{" "}
              <span
                className="cursor-pointer"
                onClick={() => handleDeletePost(t.id)}
              >
                <TrashCanSVG />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
