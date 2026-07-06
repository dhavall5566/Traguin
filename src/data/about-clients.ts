export type AboutClientLogo = {
  id: string;
  name: string;
  logoSrc: string;
};

/** Corporate client logos shown on the About page marquee. */
export const aboutClientLogos: AboutClientLogo[] = [
  { id: "havells", name: "Havells", logoSrc: "/images/clients/havells.png" },
  { id: "itc", name: "ITC Limited", logoSrc: "/images/clients/itc.png" },
  { id: "realme", name: "realme", logoSrc: "/images/clients/realme.png" },
  { id: "hdfc", name: "HDFC Bank", logoSrc: "/images/clients/hdfc.png" },
  { id: "yes-bank", name: "YES BANK", logoSrc: "/images/clients/yes-bank.png" },
  { id: "godrej", name: "Godrej", logoSrc: "/images/clients/godrej.png" },
  { id: "msc", name: "MSC", logoSrc: "/images/clients/msc.png" },
  { id: "cargill", name: "Cargill", logoSrc: "/images/clients/cargill.png" },
  { id: "pil", name: "PIL", logoSrc: "/images/clients/pil.png" },
  { id: "guardian", name: "Guardian", logoSrc: "/images/clients/guardian.png" },
];
