import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as z from 'zod'

import { PasswordField } from '@/components/form/password-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { authClient } from '@/lib/auth/auth-client'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    signOutDevices: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'The two passwords do not match.',
    path: ['confirmPassword'],
  })

export function ChangePassword() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      signOutDevices: false,
    },
    validators: {
      onChange: ({ value }) => {
        const result = changePasswordSchema.safeParse(value)
        if (!result.success) {
          return result.error.formErrors.fieldErrors
        }
        return
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.changePassword({
          newPassword: value.newPassword,
          currentPassword: value.currentPassword,
          revokeOtherSessions: value.signOutDevices,
        })
        if (res.error) {
          toast.error(
            res.error.message ||
              "Couldn't change your password! Make sure it's correct",
          )
        } else {
          setOpen(false)
          form.reset()
          toast.success('Password changed successfully')
        }
      } catch (error) {
        toast.error('An error occurred while changing password')
      }
    },
  })
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="z-10 gap-2" size="sm" variant="outline">
          <svg
            height="1em"
            viewBox="0 0 24 24"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 18.5v-1h19v1zm.535-5.973l-.762-.442l.965-1.693h-1.93v-.884h1.93l-.965-1.642l.762-.443L4 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L4 10.835zm8 0l-.762-.442l.966-1.693H9.308v-.884h1.93l-.965-1.642l.762-.443L12 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L12 10.835zm8 0l-.762-.442l.966-1.693h-1.931v-.884h1.93l-.965-1.642l.762-.443L20 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L20 10.835z"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm text-muted-foreground">
            {t('CHANGE_PASSWORD')}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('CHANGE_PASSWORD')}</DialogTitle>
          <DialogDescription>{t('CHANGE_PASSWORD_DESC')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <form.Field
            children={(field) => (
              <PasswordField
                field={field}
                label={t('CURRENT_PASSWORD')}
                placeholder={t('PASSWORD')}
              />
            )}
            name="currentPassword"
          />
          <form.Field
            children={(field) => (
              <PasswordField
                field={field}
                label={t('NEW_PASSWORD')}
                placeholder={t('NEW_PASSWORD')}
              />
            )}
            name="newPassword"
          />
          <form.Field
            children={(field) => (
              <PasswordField
                field={field}
                label={t('CONFIRM_PASSWORD')}
                placeholder={t('CONFIRM_PASSWORD')}
              />
            )}
            name="confirmPassword"
          />
          <div className="flex items-center gap-2">
            <form.Field
              children={(field) => (
                <>
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <p className="text-sm">{t('SIGN_OUT_DEVICES')}</p>
                </>
              )}
              name="signOutDevices"
            />
          </div>
        </div>
        <DialogFooter>
          <form.Subscribe
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting}
                onClick={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  t('CHANGE_PASSWORD')
                )}
              </Button>
            )}
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
