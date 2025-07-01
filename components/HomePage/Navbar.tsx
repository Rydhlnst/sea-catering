"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Carrot,
  List,
  Tree,
  SignOut,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose, // Import SheetClose for mobile nav links
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu data remains the same
const menu = [
  { title: "Home", url: "/" },
  { title: "Menu", url: "/menu" },
  { title: "Subscription", url: "/subscription" },
  {
    title: "About",
    url: "#", // Parent URL, not a direct link
    items: [
      {
        title: "Our Story",
        description: "Learn more about SEA Catering’s mission and vision.",
        icon: <Tree size={20} />,
        url: "/about",
      },
    ],
  },
  { title: "Contact", url: "/contact" },
];

const auth = {
  login: { title: "Log In", url: "/login" },
  signup: { title: "Sign Up", url: "/sign-up" },
};

// Helper function remains the same
const getInitials = (name: string) => {
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
};

// Navbar Component
const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname(); // Get the current path

  return (
    <div className="absolute top-0 left-0 right-0">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background/80 backdrop-blur-md border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full z-50">
        <div className="h-full flex items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <Carrot weight="fill" className="text-primary text-2xl" />
            <span className="text-primary">SEA</span> Catering
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {menu.map((item) => {
                // Check if any sub-item is active for the parent trigger
                const isParentActive =
                  item.items?.some((subItem) => pathname === subItem.url) ?? false;

                return item.items ? (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger
                      className={`${navigationMenuTriggerStyle()} bg-transparent ${
                        isParentActive ? "font-bold text-primary" : ""
                      }`}
                    >
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
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className={`${navigationMenuTriggerStyle()} bg-transparent ${
                          pathname === item.url ? "font-bold text-primary" : ""
                        }`}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right-side buttons / Avatar */}
          <div className="flex items-center gap-3">
            {/* User Avatar/Login buttons remain the same */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                      <AvatarFallback>{getInitials(user.name ?? "U")}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <SignOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className="hidden sm:inline-flex rounded-full">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button className="rounded-full" onClick={() => signIn()}>
                  {auth.signup.title}
                </Button>
              </>
            )}

            {/* Mobile Sheet Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <List size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="pt-0 pb-0 overflow-y-auto h-screen">
                  <SheetHeader className="px-6 py-5 border-b border-border/50" />
                  <div className="flex flex-col h-full">
                    {/* MODIFICATION: Added mobile menu items with active state */}
                    <div className="px-6 py-6 space-y-2 flex-grow">
                      {menu.map((item) =>
                        item.items ? (
                          <div key={item.title}>
                            <h4 className="font-semibold text-muted-foreground mb-2 mt-4 px-4">
                              {item.title}
                            </h4>
                            {item.items.map((subItem) => (
                              <SheetClose asChild key={subItem.title}>
                                <Link
                                  href={subItem.url}
                                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-lg transition-colors hover:bg-muted ${
                                    pathname === subItem.url ? "font-bold text-primary bg-muted" : ""
                                  }`}
                                >
                                  {subItem.icon} {subItem.title}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        ) : (
                          <SheetClose asChild key={item.title}>
                            <Link
                              href={item.url}
                              className={`flex items-center rounded-lg px-4 py-3 text-lg transition-colors hover:bg-muted ${
                                pathname === item.url ? "font-bold text-primary bg-muted" : ""
                              }`}
                            >
                              {item.title}
                            </Link>
                          </SheetClose>
                        )
                      )}
                    </div>
                    {/* User info in mobile menu remains the same */}
                    <div className="px-6 py-6 space-y-3 border-t border-border/50">
                      {user ? (
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                            <AvatarFallback>{getInitials(user.name ?? "U")}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold">{user.name}</span>
                            <Button
                              variant="link"
                              className="p-0 h-auto justify-start text-red-500"
                              onClick={() => signOut()}
                            >
                              Log out
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Button asChild variant="outline" className="w-full rounded-full h-12 text-base">
                              <Link href={auth.login.url}>{auth.login.title}</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild className="w-full rounded-full h-12 text-base">
                              <Link href={auth.signup.url}>{auth.signup.title}</Link>
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;