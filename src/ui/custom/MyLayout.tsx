
"use client";

import React from "react";
import { FeatherBarChart2 } from "@subframe/core";
import { FeatherChevronsUpDown } from "@subframe/core";
import { FeatherHome } from "@subframe/core";
import { FeatherInbox } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherUserPlus } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "../components/Avatar";
import { DropdownMenu } from "../components/DropdownMenu";
import { SidebarCollapsible } from "../components/SidebarCollapsible";
import * as SubframeUtils from "../utils";
import Image from "next/image";
import ikampusLogo from "../../assets/images/iwhite.jpg";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLDivElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-screen w-full items-start",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <SidebarCollapsible
        header={
          <Image
            alt="ikampus"
            className="h-6 w-6 flex-none object-cover"
            src={ikampusLogo}
          />

        }
        footer={
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <div className="flex grow shrink-0 basis-0 items-center gap-4">
                <div className="flex grow shrink-0 basis-0 items-start gap-4">
                  <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg">
                    A
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      Irvin
                    </span>
                    <span className="text-caption font-caption text-subtext-color">
                      Founder
                    </span>
                  </div>
                </div>
                <FeatherChevronsUpDown className="text-body font-body text-default-font" />
              </div>
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content
                side="top"
                align="start"
                sideOffset={8}
                asChild={true}
              >
                <DropdownMenu>
                  <DropdownMenu.DropdownItem icon={<FeatherUserPlus />}>
                    Invite team
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon={<FeatherSettings />}>
                    Settings
                  </DropdownMenu.DropdownItem>
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                  <DropdownMenu.DropdownItem icon={<FeatherLogOut />}>
                    Sign out
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        }
      >
        <SidebarCollapsible.NavItem icon={<FeatherHome />} selected={true}>
          Home
        </SidebarCollapsible.NavItem>
        <SidebarCollapsible.NavItem icon={<FeatherInbox />}>
          Inbox
        </SidebarCollapsible.NavItem>
        <SidebarCollapsible.NavItem icon={<FeatherBarChart2 />}>
          Reports
        </SidebarCollapsible.NavItem>
      </SidebarCollapsible>
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});


export const MyLayout = DefaultPageLayoutRoot;