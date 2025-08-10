import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLocation } from 'react-router-dom'

// Replace with your public key via env preferably
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
const stripePromise = loadStripe('pk_test_51RsbIGRzGmdod9Q4X80Ysekh8oXhUe7bQxDuxxE8fMceaVbXhSS9zaH2mVnNE8XhD8i2D4fZPejJKC7eyRibZty300ScfBZtmq')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/subscription',
      },
    })

    if (error) {
        console.error(error)
      setErrorMessage(error.message || 'Payment failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? 'Processing...' : 'Pay now'}
      </Button>
    </form>
  )
}

export default function PaymentPage() {
  const location = useLocation()
  const state = (location.state || {}) as { amount?: number; currency?: string; plan?: string }
  const amount = typeof state.amount === 'number' ? state.amount : 999
  const currency = state.currency || 'myr'
  const plan = state.plan || 'Unknown'

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('http://localhost:8000/api/payment/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency, plan }),
          signal: controller.signal,
        })
        if (!res.ok) {
          const t = await res.text()
        //   toast.error(t)
          throw new Error(t || 'Failed to create payment intent')
        }
        const data = await res.json()
        setClientSecret(data.clientSecret)
        // toast.success(`You have successfully paid ${currency.toUpperCase()}${(amount / 100).toFixed(2)} for ${plan} plan`);
      } catch (e: unknown) {
        const err = e as DOMException
        if (err && err.name === 'AbortError') {
          return
        }
        // toast.error('Failed to initialize payment')
        setError(e instanceof Error ? e.message : 'Failed to initialize payment')
      } finally {
        setLoading(false)
      }
    })()
    return () => controller.abort()
  }, [amount, currency, plan])

  return (
    <div className="flex justify-center w-full p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Complete your subscription payment</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="mb-2 text-sm text-slate-600">Plan: {plan} — Amount: {(amount / 100).toFixed(2)} {currency.toUpperCase()}</div>
          {loading && <div>Preparing checkout...</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {!loading && clientSecret && stripePromise && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  )
}