interface NewAddressLayoutProps {
  children: React.ReactNode;
}

export default function NewAddressLayout({ children }: NewAddressLayoutProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col justify-center gap-5 px-10">
      {children}
    </div>
  );
}
