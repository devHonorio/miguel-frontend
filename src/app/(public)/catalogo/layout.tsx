import { LayoutProps } from "@/app/layout";

export default function CatalogLayout({ children }: LayoutProps) {
  return (
    <div className="bg-primary/5 flex flex-1 flex-wrap content-center justify-center gap-10 p-10">
      {children}
    </div>
  );
}
