export default function Footer() {
  return (
    // bg-[#354b2e] is a darker shade of your brand green (#4A6741)
    // text-nora-beige/60 gives it a soft, non-intrusive look
    <footer className="h-[8dvh] bg-[#354b2e] text-nora-beige/60 py-4 text-center flex items-center justify-center text-sm font-medium border-t border-white/10">
      <p>&copy; {new Date().getFullYear()} Nora Foods. All rights reserved.</p>
    </footer>
  );
}
