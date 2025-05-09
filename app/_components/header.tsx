import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-4 px-4 absolute top-0 right-0 z-10">
      <div className="container mx-auto flex items-center justify-end pr-4">
        {/* Vertical Shortcut button */}
        <Link 
          href="https://www.verticalshortcut.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105 text-[#FF6B49] font-bold text-xl"
        >
          <div className="flex items-center">
            <div className="mr-2 rounded-full overflow-hidden w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#FF6B49] to-[#FF9F51]">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span>the vertical shortcut.</span>
          </div>
        </Link>
      </div>
    </header>
  );
} 