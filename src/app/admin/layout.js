"use client";
import PrivateRoute from "@/app/components/PrivateRoute";
import NavBar from "../components/Header";

export default function ProtectedLayout({ children }) {
  return (
    <PrivateRoute>
      <main className="flex h-screen">
        <div className="flex-1">
          <NavBar />
          <div className="p-2 h-[85%] w-full">
            {children}
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}