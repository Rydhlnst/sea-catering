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
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 font-bold text-lg tracking-tight"
        >
          <Carrot className="text-primary text-2xl" />
          <span className="text-primary">SEA</span> Catering
        </Link>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:block">
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

        {/* Auth Buttons + Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex rounded-full">
            <Link href={auth.login.url}>{auth.login.title}</Link>
          </Button>
          <Button className="rounded-full">
            <Link href={auth.signup.url}>{auth.signup.title}</Link>
          </Button>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="rounded-full">
                  <List size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-10">
                <SheetHeader>
                  <SheetTitle>
                    <Carrot className="inline-block mr-1" />
                    SEA Catering
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {menu.map((item) =>
                    item.items ? (
                      <div key={item.title}>
                        <p className="font-semibold mb-1">{item.title}</p>
                        <ul className="pl-4 space-y-2">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.url}
                                className="text-sm text-muted-foreground hover:text-primary"
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
                          className="block font-medium hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      </div>
                    )
                  )}
                  <div className="pt-4 space-y-2">
                    <Button asChild variant="outline" className="w-full rounded-full">
                      <Link href={auth.login.url}>{auth.login.title}</Link>
                    </Button>
                    <Button asChild className="w-full rounded-full">
                      <Link href={auth.signup.url}>{auth.signup.title}</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
