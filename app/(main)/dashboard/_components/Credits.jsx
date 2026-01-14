import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import React, { useContext } from 'react'
import { loadRazorpay } from '@/lib/razorpay'
import { useUser } from '@stackframe/stack'
import { toast } from 'react-toastify'


const Credits = () => {
  const { userData } = useContext(UserContext)
  const user = useUser()
  const upgradeUser = useMutation(api.users.UpgradeToPro)

  const calculateProgress = () => {
    return (userData?.credits / 5000) * 100
  }

  const handlePayment = async () => {
    const loaded = await loadRazorpay()
    if (!loaded) {
      toast.error("Razorpay SDK failed to load")
      return
    }

    const res = await fetch("/api/razorpay", { method: "POST" })
    const order = await res.json()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "VoxNova",
      description: "Pro Plan Subscription",
      order_id: order.id,

      handler: async () => {
        await upgradeUser({ id: userData._id })
        toast.success("Payment Successful")
      },

      prefill: {
        name: user?.displayName,
        email: user?.primaryEmail,
      },

      theme: { color: "#000000" },

      modal: {
        ondismiss: () => {
          toast.warning("Payment cancelled")
        },
      },
    }

    const razorpay = new window.Razorpay(options)

    // PAYMENT FAILURE EVENT
    razorpay.on("payment.failed", () => {
      toast.error("Payment unsuccessful!")
    })

    razorpay.open()
  }

  return (
    <div>
      <div className="flex gap-5 items-center">
        <Image
          src={user?.profileImageUrl}
          width={60}
          height={60}
          className="rounded-full"
          alt="profile"
        />
        <div>
          <h2 className="text-lg font-bold text-black">{user?.displayName}</h2>
          <h2 className="text-gray-500">{user?.primaryEmail}</h2>
        </div>
      </div>

      <hr className="my-3" />

      <h2 className="font-bold">Token Usage</h2>
      <h2>{userData?.credits}/5000</h2>
      <Progress value={calculateProgress()} className="my-3" />

      <div className="flex justify-between items-center mt-3">
        <h2 className="font-bold">Current Plan</h2>
        <h2 className="px-2 py-1 bg-secondary rounded-lg">
          {userData?.subscriptionId ? "Paid Plan" : "Free Plan"}
        </h2>
      </div>

      {!userData?.subscriptionId && (
        <div className="mt-5 p-5 border rounded-2xl">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold">Pro Plan</h2>
              <h2>5000 Tokens</h2>
            </div>
            <h2 className="font-bold">₹100 / Month</h2>
          </div>

          <hr className="my-3" />

          <Button onClick={handlePayment} className="w-full cursor-pointer">
            <Wallet2 className="mr-2" /> Upgrade ₹100
          </Button>
        </div>
      )}
    </div>
  )
}

export default Credits
