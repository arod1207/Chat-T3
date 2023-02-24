import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-20 items-center justify-between bg-gradient-to-r from-transparent  to-black px-6">
      <h1 className="text-2xl font-bold text-white">Chat T3</h1>
      <div className="flex items-center space-x-6">
        <button
          className="h-1/2 rounded-md bg-purple-500 p-2 font-semibold text-white"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
          {sessionData ? "Sign out" : "Sign in with Discord"}
        </button>
        {sessionData ? (
          <div className="flex items-center space-x-6">
            <img
              className="h-12 w-12 rounded-full"
              src={sessionData.user.image || undefined}
            />
            <h3 className="text-white">{sessionData.user.email}</h3>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
