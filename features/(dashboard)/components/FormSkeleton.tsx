import Navbar from "@/components/layout/Navbar";

export default function FormSkeleton() {
  return (
    <>
      <Navbar forceScrolled />
      <main style={{ background: "#FAF6F0" }} className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="h-3 w-40 bg-[#E8E5D8] rounded animate-pulse mb-8" />
          <div className="h-9 w-56 bg-[#E8E5D8] rounded animate-pulse mb-2" />
          <div className="h-3 w-44 bg-[#E8E5D8] rounded animate-pulse mb-8" />

          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6"
            style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}>
            {[80, 60, 40, 40, 60].map((w, i) => (
              <div key={i}>
                <div className="h-2.5 w-20 bg-[#E8E5D8] rounded animate-pulse mb-2" />
                <div className={`h-12 bg-[#E8E5D8] rounded-xl animate-pulse`}
                  style={{ animationDelay: `${i * 60}ms` }} />
              </div>
            ))}
            <div>
              <div className="h-2.5 w-16 bg-[#E8E5D8] rounded animate-pulse mb-2" />
              <div className="h-28 bg-[#E8E5D8] rounded-2xl animate-pulse" />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <div className="h-12 w-28 bg-[#E8E5D8] rounded-2xl animate-pulse" />
            <div className="h-12 w-36 bg-[#E8E5D8] rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
    </>
  );
}
