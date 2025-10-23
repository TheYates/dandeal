"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DropdownManagement } from "@/components/dropdown-management";

export function DropdownManagementAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="services">
      <AccordionItem value="services">
        <AccordionTrigger className="text-lg font-semibold">
          Services
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <DropdownManagement
            title="Services"
            description="Manage the service options available in the consultation form"
            type="services"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping_methods">
        <AccordionTrigger className="text-lg font-semibold">
          Shipping Methods
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <DropdownManagement
            title="Shipping Methods"
            description="Manage the shipping method options available in the quote form"
            type="shipping_methods"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cargo_types">
        <AccordionTrigger className="text-lg font-semibold">
          Cargo Types
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <DropdownManagement
            title="Cargo Types"
            description="Manage the cargo type options available in the quote form"
            type="cargo_types"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

