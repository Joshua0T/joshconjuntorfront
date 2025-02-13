import NavBar from "./components/Header";

export default function Home() {
  return (
    <div className="h-screen w-full">
      <NavBar />
      <main className="h-[85%] w-full flex flex-col justify-center items-center text-6xl">
        <h1 className="text-verde"></h1>
      </main>
    </div>
  );
}
