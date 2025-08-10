import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js'

export default function SubscriptionPage(){
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const justLoggedOut = useRef(false);

  async function makePayment(){
    const stripePromise = await loadStripe('pk_test_51RsbIGRzGmdod9Q4X80Ysekh8oXhUe7bQxDuxxE8fMceaVbXhSS9zaH2mVnNE8XhD8i2D4fZPejJKC7eyRibZty300ScfBZtmq')
  }

  useEffect(() => {
      if (!isLoading && user === null) {
          if (!justLoggedOut.current) {
              // toast.error("You must be logged in to access the dashboard.");
          }
          navigate("/")
          justLoggedOut.current = false; // reset after redirect
      }
      console.log(user)
  }, [user, isLoading, navigate]);

  if (isLoading || user === null) {
      return null;
  }

  const membership = user.userMembership;

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-2xl font-semibold">Subscription</h1>
      </div>

      {/* <p className='text-blue-800 font-medium text-2xl'>
        User Email : {user?.email}
      </p>
      <div className='text-blue-800 font-medium text-2xl'>
        <div>Membership: {membership?.membership_type?.name ?? '-'}</div>
        <div>Since: {membership?.created_at ?? '-'}</div>
      </div> */}

      <div className="card-container flex justify-center w-full">
        <Card className="w-full mx-20 my-20">
          <CardHeader>
            <CardTitle>Subscription Price</CardTitle>
            <CardDescription>This is for subscription price</CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Card className="w-full mx-5 my-10">
                <CardHeader>
                  <CardTitle>Normal Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl">RM9.99</p>
                  <div className="flex justify-center w-full flex-wrap items-center gap-2 md:flex-row mt-2">
                    {membership?.membership_type?.name === "Normal" ? (
                      <Button onClick={makePayment} disabled className="w-full max-w-full bg-gray-400 cursor-not-allowed">
                        Current Subscription
                      </Button>
                    ) : (
                      <Link className="block w-full" to="/payment" state={{ amount: 999, currency: 'myr', plan: 'Normal' }}>
                        <Button className="w-full max-w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer">
                          Subscribe
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full mx-5 my-10">
                <CardHeader>
                  <CardTitle>Advanced Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl">RM14.99</p>
                  <div className="flex justify-center w-full flex-wrap items-center gap-2 md:flex-row mt-2">
                    {membership?.membership_type?.name === "Advanced" ? (
                      <Button disabled className="w-full max-w-full bg-gray-400 cursor-not-allowed">
                        Current Subscription
                      </Button>
                    ) : (
                      <Link className="block w-full" to="/payment" state={{ amount: 1499, currency: 'myr', plan: 'Advanced' }}>
                        <Button className="w-full max-w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer">
                          Subscribe
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full mx-5 my-10">
                <CardHeader>
                  <CardTitle>Premium Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-2xl">RM16.99</p>
                  <div className="flex justify-center w-full flex-wrap items-center gap-2 md:flex-row mt-2">
                    {membership?.membership_type?.name === "Premium" ? (
                      <Button disabled className="w-full max-w-full bg-gray-400 cursor-not-allowed">
                        Current Subscription
                      </Button>
                    ) : (
                      <Link className="block w-full" to="/payment" state={{ amount: 1699, currency: 'myr', plan: 'Premium' }}>
                        <Button className="w-full max-w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer">
                          Subscribe
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 