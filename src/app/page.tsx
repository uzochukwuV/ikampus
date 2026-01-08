"use client";

import React from "react";
import { Avatar } from "@/ui/components/Avatar";
import { ChatSelect } from "@/ui/components/ChatSelect";
import { ChatSelectItem } from "@/ui/components/ChatSelectItem";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconButton } from "@/ui/components/IconButton";
import { Switch } from "@/ui/components/Switch";
import { TextFieldUnstyled } from "@/ui/components/TextFieldUnstyled";
import { Tooltip } from "@/ui/components/Tooltip";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherArrowUp } from "@subframe/core";
import { FeatherBook } from "@subframe/core";
import { FeatherCloud } from "@subframe/core";
import { FeatherFilePlus2 } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherInfo } from "@subframe/core";
import { FeatherLaptop } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import { FeatherMessageCircle } from "@subframe/core";
import { FeatherPaperclip } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherSparkles } from "@subframe/core";
import { FeatherUserCog2 } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { MyLayout } from "../ui/custom/MyLayout";

function ChatGptNewChat2() {
  return (
    <MyLayout>
      <div className="flex h-full w-full flex-col items-start">
        <div className="flex w-full items-center justify-between px-3 py-3">
          <SubframeCore.Popover.Root>
            <SubframeCore.Popover.Trigger asChild={true}>
              <ChatSelect>University Of Northampton</ChatSelect>
            </SubframeCore.Popover.Trigger>
            <SubframeCore.Popover.Portal>
              <SubframeCore.Popover.Content
                side="bottom"
                align="start"
                sideOffset={4}
                asChild={true}
              >
                <div className="flex w-80 flex-none flex-col items-start gap-1 rounded-md border border-solid border-neutral-border bg-default-background py-2 shadow-lg">
                  <div className="flex w-full items-center gap-2 px-5 pt-2 pb-1">
                    <span className="grow shrink-0 basis-0 text-caption font-caption text-subtext-color">
                      Model
                    </span>
                    <SubframeCore.Tooltip.Provider>
                      <SubframeCore.Tooltip.Root>
                        <SubframeCore.Tooltip.Trigger asChild={true}>
                          <FeatherInfo className="text-body font-body text-neutral-400" />
                        </SubframeCore.Tooltip.Trigger>
                        <SubframeCore.Tooltip.Portal>
                          <SubframeCore.Tooltip.Content
                            side="top"
                            align="center"
                            sideOffset={4}
                            asChild={true}
                          >
                            <Tooltip>Learn more about models</Tooltip>
                          </SubframeCore.Tooltip.Content>
                        </SubframeCore.Tooltip.Portal>
                      </SubframeCore.Tooltip.Root>
                    </SubframeCore.Tooltip.Provider>
                  </div>
                  <div className="flex w-full flex-col items-start gap-1 px-2">
                    <ChatSelectItem
                      title="GPT-4o"
                      subtitle="Great for most tasks"
                    />
                    <ChatSelectItem
                      title="o1"
                      subtitle="Uses advanced reasoning"
                      selected={true}
                    />
                    <ChatSelectItem
                      title="o1-mini"
                      subtitle="Faster at reasoning"
                    />
                  </div>
                  <div className="flex w-full flex-col items-start gap-1 px-5 py-1">
                    <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
                  </div>


<div className="flex w-full items-start gap-4 px-5 py-3">
                    <FeatherMessageCircle className="text-heading-2 font-heading-2 text-subtext-color" />
                    <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                      Temporary chat
                    </span>
                    <Switch
                      checked={false}
                      onCheckedChange={(checked: boolean) => {}}
                    />
                  </div>
                </div>
              </SubframeCore.Popover.Content>
            </SubframeCore.Popover.Portal>
          </SubframeCore.Popover.Root>
          <div className="flex items-center justify-end gap-6 px-2 py-2">
            <FeatherMessageCircle className="text-heading-1 font-heading-1 text-default-font" />
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif">
                  A
                </Avatar>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu className="h-auto w-64 flex-none">
                    <DropdownMenu.DropdownItem
                      className="h-10 w-full flex-none"
                      icon={<FeatherUserCog2 />}
                    >
                      My GPTs
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem
                      className="h-10 w-full flex-none"
                      icon={<FeatherBook />}
                    >
                      Customize ChatGPT
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem
                      className="h-10 w-full flex-none"
                      icon={<FeatherSettings />}
                    >
                      Settings
                    </DropdownMenu.DropdownItem>
                    <div className="flex w-full flex-col items-start px-2 py-2">
                      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
                    </div>
                    <DropdownMenu.DropdownItem
                      className="h-10 w-full flex-none"
                      icon={<FeatherLaptop />}
                    >
                      Download the macOS app
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem
                      className="h-10 w-full flex-none"
                      icon={<FeatherSparkles />}
                    >
                      Upgrade plan
                    </DropdownMenu.DropdownItem>
                    <div className="flex w-full flex-col items-start px-2 py-2">
                      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
                    </div>
                    <DropdownMenu.DropdownItem
                      className="h-10 w-full flex-none"
                      icon={<FeatherLogOut />}
                    >
                      Log out
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </div>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-end gap-4 bg-default-background px-6 py-6 overflow-auto">
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-center gap-2 px-2 py-2">
            <span className="text-heading-1 font-heading-1 text-default-font text-center">
              Hello Lloyd
            </span>
            <span className="text-body font-body text-subtext-color text-center">
              Make writing more interesting
            </span>
          </div>


<div className="flex w-full flex-col items-center justify-center gap-7">
            <div className="flex w-full max-w-[768px] flex-col items-start rounded-lg bg-neutral-100 px-3 py-2">
              <div className="flex w-full flex-col items-start gap-2 px-2 py-2">
                <TextFieldUnstyled className="h-auto w-full flex-none">
                  <TextFieldUnstyled.Input
                    placeholder="Message Ikampus..."
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextFieldUnstyled>
              </div>
              <div className="flex w-full items-start gap-2">
                <div className="flex grow shrink-0 basis-0 items-start gap-1">
                  <SubframeCore.DropdownMenu.Root>
                    <SubframeCore.DropdownMenu.Trigger asChild={true}>
                      <IconButton
                        icon={<FeatherPaperclip />}
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {}}
                      />
                    </SubframeCore.DropdownMenu.Trigger>
                    <SubframeCore.DropdownMenu.Portal>
                      <SubframeCore.DropdownMenu.Content
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        asChild={true}
                      >
                        <DropdownMenu>
                          <DropdownMenu.DropdownItem icon={<FeatherCloud />}>
                            Connect to Google Drive
                          </DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem
                            icon={<FeatherFilePlus2 />}
                          >
                            Upload from computer
                          </DropdownMenu.DropdownItem>
                        </DropdownMenu>
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Portal>
                  </SubframeCore.DropdownMenu.Root>
                  <IconButton
                    icon={<FeatherGlobe />}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                  />
                </div>
                <IconButton
                  variant="brand-primary"
                  icon={<FeatherArrowUp />}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MyLayout >
  );
}

export default ChatGptNewChat2;