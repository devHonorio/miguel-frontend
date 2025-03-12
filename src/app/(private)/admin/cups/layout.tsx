import { LayoutProps } from "@/app/layout";

export default function CupsLayout({ children }: LayoutProps) {
  return <div className="flex w-full flex-col gap-5 px-10">{children}</div>;
}
