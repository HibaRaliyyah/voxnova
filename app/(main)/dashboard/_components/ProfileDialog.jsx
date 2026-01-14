import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Credits from './Credits'

const ProfileDialog = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="text-black">
        <DialogHeader>
          <DialogTitle className="text-black"></DialogTitle>

          <DialogDescription className="text-black">
            <Credits />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog
