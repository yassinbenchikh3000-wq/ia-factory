export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-[70vh] fade-in">
      <div className="cyber-card p-10 w-full max-w-md">
        <h1 className="text-3xl text-pink-400 mb-6 font-bold text-center">Sign In</h1>

        <input className="w-full p-3 bg-black border border-pink-500 rounded mb-4" placeholder="Email" />
        <input className="w-full p-3 bg-black border border-pink-500 rounded mb-6" placeholder="Password" type="password" />

        <button className="cyber-btn w-full py-3">Login</button>
      </div>
    </div>
  );
}