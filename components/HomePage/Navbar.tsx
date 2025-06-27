"use client";

import {
  BookOpenText,
  Carrot,
  List,
  SunDim,
  Tree,
} from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const menu = [
  { title: "Home", url: "/" },
  { title: "Menu", url: "/menu" },
  { title: "Subscription", url: "/subscription" },
  {
    title: "About",
    url: "#",
    items: [
      {
        title: "Our Story",
        description: "Learn more about SEA Catering’s mission and vision.",
        icon: <Tree size={20} />,
        url: "/about",
      },
      {
        title: "Nutritional Info",
        description: "Detailed nutrition data for each meal plan.",
        icon: <BookOpenText size={20} />,
        url: "/nutrition",
      },
      {
        title: "Testimonials",
        description: "What our happy customers have to say.",
        icon: <SunDim size={20} />,
        url: "/testimonials",
      },
    ],
  },
  { title: "Contact", url: "/contact" },
];

const auth = {
  login: { title: "Log In", url: "/login" },
  signup: { title: "Sign Up", url: "/signup" },
};

const Navbar = () => {
  return (
    <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full z-50">
      <div className="h-full flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 font-bold text-lg tracking-tight"
        >
          <Carrot className="text-primary text-2xl" />
          <span className="text-primary">SEA</span> Catering
        </Link>

        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList>
            {menu.map((item) =>
              item.items ? (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4 rounded-md">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.url}
                            className="flex gap-3 p-2 rounded-md hover:bg-muted transition"
                          >
                            <div className="text-primary">{subItem.icon}</div>
                            <div>
                              <div className="font-semibold">{subItem.title}</div>
                              <p className="text-sm text-muted-foreground">
                                {subItem.description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.url}>{item.title}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex rounded-full">
            <Link href={auth.login.url}>{auth.login.title}</Link>
          </Button>
          <Button className="rounded-full">
            <Link href={auth.signup.url}>{auth.signup.title}</Link>
          </Button>

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="rounded-full">
                <List size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-0 pb-0 overflow-y-auto h-[calc(100vh-0px)]">
              <SheetHeader className="px-6 py-5 border-b border-border/50">
                <SheetTitle className="flex items-center text-xl font-bold">
                  <Link href="/" className="flex items-center gap-2">
                    <Carrot className="inline-block mr-1 text-primary" size={24} />
                    SEA Catering
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="px-6 py-6 space-y-4 flex-grow">
                  {menu.map((item) =>
                    item.items ? (
                      <div key={item.title}>
                        <p className="font-semibold text-lg mb-2">{item.title}</p>
                        <ul className="pl-4 space-y-3">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.url}
                                className="block text-base text-muted-foreground hover:text-primary transition-colors py-1"
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div key={item.title}>
                        <Link
                          href={item.url}
                          className="block font-semibold text-lg hover:text-primary transition-colors py-2"
                        >
                          {item.title}
                        </Link>
                      </div>
                    )
                  )}
                </div>
                <div className="px-6 py-6 space-y-3 border-t border-border/50">
                  <Button asChild variant="outline" className="w-full rounded-full h-12 text-base">
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button asChild className="w-full rounded-full h-12 text-base">
                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
