import { CloseSVG } from "./SVGs";

type modalProps = {
  setShow: (show: boolean) => void;
  show: boolean;
};

export default function Modal({ setShow }: modalProps) {
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
          <h1 className="text-center font-semibold text-black">Your Post</h1>
        </div>
      </div>
    </div>
  );
}
