import InitializeWallet from "../InitializeWallet";
import ConnectButton from "../ConnectButton/ConnectButton";
import LoadAppState from "../LoadAppState"

export default function Layout({ children }) {
  return (
    <div className="bg-radial-gradient">
      <InitializeWallet />
      <LoadAppState />
      <div className="relative">
        <div className="backdrop-blur sticky top-0 left-0">
          <div className="flex flex-row items-center justify-between py-4 pr-4 pl-5 text-white">
            <p className="font-bold text-2xl">The Field</p>
            <ConnectButton />
          </div>
        </div>
        <main className="text-white">
          <div className="mt-2 md:mt-4 max-w-container.xl px-6 min-h-[90vh]">
            {children}
          </div>
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
