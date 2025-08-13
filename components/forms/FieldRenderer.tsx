"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MaskedTextInput } from "../ui/MaskedTextInput";
import { MultiSelectChips } from "../ui/MultiSelectChips";
import { FileInput } from "../ui/FileInput";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { MockDataClient } from "@/lib/data/MockDataClient";

interface FieldRendererProps {
  field: any;
  form: UseFormReturn<any>;
}

const dataClient = new MockDataClient();

export function FieldRenderer({ field, form }: FieldRendererProps) {
  const [lookupData, setLookupData] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const fieldValue = form.watch(field.name);

  // Handle lookup operations (PIN code, IFSC, etc.)
  useEffect(() => {
    if (field.format === "pincode" && fieldValue && fieldValue.length === 6) {
      handlePincodeLookup(fieldValue);
    } else if (field.format === "ifsc" && fieldValue && fieldValue.length === 11) {
      handleIfscLookup(fieldValue);
    }
  }, [fieldValue, field.format]);

  const handlePincodeLookup = async (pincode: string) => {
    setIsLookingUp(true);
    try {
      const result = await dataClient.lookupPin(pincode);
      if (result) {
        setLookupData(result);
        // Auto-populate state and district fields
        form.setValue("state", result.state);
        form.setValue("district", result.district);
      }
    } catch (error) {
      console.error("PIN code lookup failed:", error);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleIfscLookup = async (ifscCode: string) => {
    setIsLookingUp(true);
    try {
      const result = await dataClient.lookupIfsc(ifscCode);
      if (result) {
        setLookupData(result);
        // Auto-populate bank details
        form.setValue("bankName", result.bank);
        form.setValue("branchName", result.branch);
      }
    } catch (error) {
      console.error("IFSC lookup failed:", error);
    } finally {
      setIsLookingUp(false);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "string":
        if (field.enum) {
          return (
            <Select
              value={fieldValue || ""}
              onValueChange={(value) => form.setValue(field.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.enum.map((option: any) => (
                  <SelectItem key={option.value || option} value={option.value || option}>
                    {option.label || option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (field.format) {
          const masks = {
            pan: "AAAAA####A",
            aadhaar: "####-####-####",
            gstin: "##AAAAA####A#A#A",
            ifsc: "AAAA#AAAAAA",
            phone: "#########",
            pincode: "######"
          };

          if (masks[field.format as keyof typeof masks]) {
            return (
              <div className="space-y-2">
                <MaskedTextInput
                  mask={masks[field.format as keyof typeof masks]}
                  placeholder={field.placeholder}
                  value={fieldValue || ""}
                  onChange={(value) => form.setValue(field.name, value)}
                  className={field.format === "pan" || field.format === "gstin" ? "uppercase" : ""}
                />
                {isLookingUp && (
                  <div className="text-xs text-blue-600">Looking up...</div>
                )}
                {lookupData && field.format === "pincode" && (
                  <div className="text-xs text-green-600">
                    Found: {lookupData.district}, {lookupData.state}
                  </div>
                )}
                {lookupData && field.format === "ifsc" && (
                  <div className="text-xs text-green-600">
                    Found: {lookupData.bank} - {lookupData.branch}
                  </div>
                )}
              </div>
            );
          }
        }

        if (field.multiline) {
          return (
            <Textarea
              placeholder={field.placeholder}
              value={fieldValue || ""}
              onChange={(e) => form.setValue(field.name, e.target.value)}
              className="min-h-[100px]"
            />
          );
        }

        return (
          <Input
            type={field.format === "email" ? "email" : "text"}
            placeholder={field.placeholder}
            value={fieldValue || ""}
            onChange={(e) => form.setValue(field.name, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={fieldValue || ""}
            onChange={(e) => form.setValue(field.name, e.target.value ? Number(e.target.value) : "")}
          />
        );

      case "boolean":
        if (field.widget === "switch") {
          return (
            <div className="flex items-center space-x-2">
              <Switch
                checked={fieldValue || false}
                onCheckedChange={(checked) => form.setValue(field.name, checked)}
              />
              <span className="text-sm">{fieldValue ? "Yes" : "No"}</span>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={fieldValue || false}
              onCheckedChange={(checked) => form.setValue(field.name, checked)}
            />
            <span className="text-sm">{field.description || "Check this box"}</span>
          </div>
        );

      case "array":
        if (field.items && field.items.enum) {
          return (
            <MultiSelectChips
              options={field.items.enum}
              value={fieldValue || []}
              onChange={(values) => form.setValue(field.name, values)}
              placeholder={field.placeholder}
            />
          );
        }
        break;

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fieldValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fieldValue ? format(new Date(fieldValue), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fieldValue ? new Date(fieldValue) : undefined}
                onSelect={(date) => form.setValue(field.name, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "file":
        return (
          <FileInput
            accept={field.accept}
            multiple={field.multiple}
            maxSize={field.maxSize}
            value={fieldValue}
            onChange={(files) => form.setValue(field.name, files)}
          />
        );

      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={fieldValue || ""}
            onChange={(e) => form.setValue(field.name, e.target.value)}
          />
        );
    }
  };

  // Check if field should be visible based on conditional logic
  const shouldShowField = () => {
    if (!field.visibleWhen) return true;
    
    const { field: conditionField, value: conditionValue } = field.visibleWhen;
    const currentValue = form.watch(conditionField);
    
    return currentValue === conditionValue;
  };

  if (!shouldShowField()) return null;

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.fullWidth ? "md:col-span-2" : ""}>
          <FormLabel className="flex items-center gap-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
            {field.badge && <Badge variant="secondary" className="text-xs">{field.badge}</Badge>}
          </FormLabel>
          <FormControl>
            {renderField()}
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          {field.example && (
            <FormDescription className="text-xs text-blue-600">
              Example: {field.example}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}