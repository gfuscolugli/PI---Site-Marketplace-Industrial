
import type { ReactNode } from 'react';

interface AuthBoxProps {
  children: ReactNode;
}

export function AuthBox({ children }: AuthBoxProps) {
  return (
    <div className="bg-white w-full p-8 rounded-2xl shadow-sm border border-[#F3F4F6]">
      {children}
    </div>
  );
}