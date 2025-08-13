"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MaskedTextInputProps {
  mask: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MaskedTextInput({ 
  mask, 
  value, 
  onChange, 
  placeholder, 
  className 
}: MaskedTextInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const applyMask = (inputValue: string, maskPattern: string) => {
    let maskedValue = "";
    let inputIndex = 0;
    
    for (let i = 0; i < maskPattern.length && inputIndex < inputValue.length; i++) {
      const maskChar = maskPattern[i];
      const inputChar = inputValue[inputIndex];
      
      if (maskChar === "#") {
        if (/\d/.test(inputChar)) {
          maskedValue += inputChar;
          inputIndex++;
        } else {
          break;
        }
      } else if (maskChar === "A") {
        if (/[A-Za-z]/.test(inputChar)) {
          maskedValue += inputChar.toUpperCase();
          inputIndex++;
        } else {
          break;
        }
      } else {
        maskedValue += maskChar;
        if (inputChar === maskChar) {
          inputIndex++;
        }
      }
    }
    
    return maskedValue;
  };

  const removeMask = (maskedValue: string) => {
    return maskedValue.replace(/[^A-Za-z0-9]/g, "");
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(applyMask(value, mask));
    } else {
      setDisplayValue("");
    }
  }, [value, mask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rawValue = removeMask(inputValue);
    const maskedValue = applyMask(rawValue, mask);
    
    setDisplayValue(maskedValue);
    onChange(rawValue);
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(className)}
    />
  );
}