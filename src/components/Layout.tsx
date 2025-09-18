import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, type ReactNode } from 'react';
import { Input } from "@/components/ui/input"

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // todo : need to use context later
  const [promoPlaceholder] = useState<string>("Find items .. 🔥");
  const [seoSearch, setSeoSearch] = useState<string>("");
  const [isLoggedIn] = useState<boolean>(false);

  const handleSeoSearch = () :void => {
    console.log(`handleSeoSearch : ${seoSearch}`)
  }

  const openCart = () :void => {
    console.log(`opencart`);
    navigate('/shopping-cart');
  }

  const goToProfile = () :void => {
    console.log(`goToProfile`);
  }

  const handleSignIn = () => {
    // If user is already authenticated, go to dashboard, otherwise show signin
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  // end todo


  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Navigation */}
      {showNavbar && (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button 
                onClick={() => navigate('/')}
                className="text-xl font-bold text-black hover:opacity-80 transition-opacity"
              >
                Bp React Vite
              </button>

              {/* SEO Searchbar */}
              <NavigationMenu className="block w-full">
                <NavigationMenuList className="gap-6">
                  <NavigationMenuItem className="block w-full">
                    <div className="relative w-[40vw]">
                      <Input
                        placeholder={promoPlaceholder}
                        className="w-full pr-10"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSeoSearch(e.target.value)}
                      />
                      <Button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 h-auto"
                        variant="ghost"
                        onClick={handleSeoSearch}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 
                              5.196 5.196a7.5 7.5 0 0 0 
                              10.607 10.607Z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>


              {/* Sign In Button */}
              <div className="flex gap-2">
                {!isLoggedIn ? (
                  <Button 
                    onClick={handleSignIn}
                    className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full text-sm"
                  >
                    {user ? "Dashboard" : "Sign In"}
                  </Button>
                ) : (
                  <Button 
                    onClick={goToProfile}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 
                          20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 
                          21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </Button>
                )}

                

                <Button
                  onClick={openCart}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 