"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function BreadcrumbInner() {
  const pathname = usePathname();

  // Split the path into parts (e.g. /settings/personal-info → ['settings', 'personal-info'])
  const segments = pathname.split("/").filter((seg) => seg !== ""); // remove empty strings

  // Build cumulative paths for each breadcrumb item
  const paths = segments.map((_, index) => {
    return "/" + segments.slice(0, index + 1).join("/");
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className=" text-gray-200 hover:text-white">
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize

          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-blue-600 font-bold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={paths[index]}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
