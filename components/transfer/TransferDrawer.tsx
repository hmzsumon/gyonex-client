/* ────────── TransferDrawer (PIN verify for actions like transfer) ────────── */

"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SymbolDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleConfirm: () => void; // ← ম্যাচ হলে এই কলব্যাক চলবে
}

export function TransferDrawer({
  open,
  setOpen,
  handleConfirm,
}: SymbolDrawerProps) {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  /* ────────── guard: no PIN set -> redirect to create PIN ────────── */
  const isSecurityPin = Boolean(user?.securityPin);
  console.log("isSecurityPin", isSecurityPin);
  useEffect(() => {
    if (!isSecurityPin) router.push("/settings/security/set-pin");
  }, [isSecurityPin, router]);

  /* ────────── local state ────────── */
  const [newPin, setNewPin] = useState("");
  const [newPinError, setNewPinError] = useState(false);
  const [newPinErrorText, setNewPinErrorText] = useState("");
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  /* ────────── derived: canConfirm ────────── */
  const canConfirm = useMemo(() => {
    return (
      newPin.length === 6 &&
      newPin === String(user?.securityPin || "") &&
      !newPinError
    );
  }, [newPin, newPinError, user?.securityPin]);

  /* ────────── input change (only digits, max 6) ────────── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setNewPin(value);

    // basic length validation live
    if (value.length < 6) {
      setNewPinError(true);
      setNewPinErrorText("PIN must be exactly 6 digits");
    } else {
      setNewPinError(false);
      setNewPinErrorText("");
    }
  };

  /* ────────── blur validation: check match to saved PIN ────────── */
  const handlePinBlur = () => {
    if (newPin.length === 6) {
      if (String(user?.securityPin || "") !== newPin) {
        setNewPinError(true);
        setNewPinErrorText("PIN does not match");
      } else {
        setNewPinError(false);
        setNewPinErrorText("");
      }
    }
  };

  /* ────────── confirm click ────────── */
  const onConfirm = async () => {
    if (!canConfirm) return;
    try {
      setIsCheckingPin(true);
      // লোকাল ভেরিফাই হয়ে গেছে; আপনার মূল action চালান
      handleConfirm();
      setOpen(false);
    } finally {
      setIsCheckingPin(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[85vh] rounded-t-3xl bg-gray-900 px-2 pb-4">
        <div className="mx-auto w-full px-4 py-2">
          <DrawerHeader>
            <DrawerTitle className="text-center text-sm text-gray-100">
              Security Verify
            </DrawerTitle>
          </DrawerHeader>
        </div>

        <div className="grid items-start gap-4 px-4">
          {/* ────────── PIN field ────────── */}
          <div className="grid gap-2">
            <Label
              htmlFor="pin"
              className={`${
                newPinError ? "text-red-500" : "text-gray-100"
              } ml-1`}
            >
              Enter Your PIN
            </Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="\d*"
              placeholder="e.g. 123456"
              value={newPin}
              onChange={handleInputChange}
              onBlur={handlePinBlur}
              className={`${
                newPinError
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-gray-100"
              }`}
            />
            {newPinError && (
              <span className="ml-1 mt-1 text-xs font-bold text-red-500">
                {newPinErrorText}
              </span>
            )}
          </div>

          {/* ────────── Confirm button ────────── */}
          <Button
            className="bg-htx-blue hover:bg-htx-blue"
            disabled={!canConfirm || isCheckingPin}
            onClick={onConfirm}
          >
            {isCheckingPin ? (
              <span className="mx-auto">
                <PulseLoader color="#fff" size={8} />
              </span>
            ) : (
              "Confirm"
            )}
          </Button>
        </div>

        <DrawerFooter className="px-4 py-2">
          <DrawerClose asChild>
            <Button variant="outline" className="bg-orange-500 text-white">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
