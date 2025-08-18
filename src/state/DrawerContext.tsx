import React, { createContext, useContext, useMemo, useState } from "react";

type DrawerTab = "nav" | "sections" | "toc" | "interview";

export type DrawerLink = { id?: string; title: string; href?: string };

type DrawerState = {
  isOpen: boolean;
  tab: DrawerTab;
  open: (tab: DrawerTab) => void;
  close: () => void;

  // Contextual content fed by pages
  sections: DrawerLink[];
  toc: { id: string; text: string; depth: number }[];
  interviewLinks: DrawerLink[];

  setSections: (items: DrawerLink[]) => void;
  setToc: (items: { id: string; text: string; depth: number }[]) => void;
  setInterviewLinks: (items: DrawerLink[]) => void;
};

const Ctx = createContext<DrawerState | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [tab, setTab] = useState<DrawerTab>("nav");
  const [sections, setSections] = useState<DrawerLink[]>([]);
  const [toc, setToc] = useState<{ id: string; text: string; depth: number }[]>(
    []
  );
  const [interviewLinks, setInterviewLinks] = useState<DrawerLink[]>([]);

  const value = useMemo<DrawerState>(
    () => ({
      isOpen,
      tab,
      open: (t) => {
        setTab(t);
        setOpen(true);
      },
      close: () => setOpen(false),
      sections,
      toc,
      interviewLinks,
      setSections,
      setToc,
      setInterviewLinks,
    }),
    [isOpen, tab, sections, toc, interviewLinks]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDrawer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDrawer must be used inside DrawerProvider");
  return v;
}
