"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeatherBarChart2 } from "@subframe/core";
import { FeatherChevronsUpDown } from "@subframe/core";
import { FeatherHome } from "@subframe/core";
import { FeatherInbox } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherUserPlus } from "@subframe/core";
import { FeatherPlusCircle } from "@subframe/core";
import { FeatherUsers } from "@subframe/core";
import { FeatherFolder } from "@subframe/core";
import { FeatherCalendar } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherChevronLeft } from "@subframe/core";
import { FeatherChevronRight } from "@subframe/core";
import { FeatherMenu } from "@subframe/core";
import { FeatherChevronDown } from "@subframe/core";
import { FeatherFlag } from "@subframe/core";
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

const DefaultPageLayoutRoot = React.forwardRef<HTMLDivElement, DefaultPageLayoutRootProps>(
  function DefaultPageLayoutRoot(
    { children, className, ...otherProps }: DefaultPageLayoutRootProps,
    ref
  ) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [expandedModules, setExpandedModules] = useState(false);
    const [isExpandedBio, setIsExpandedBio] = useState(false);

    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
    };

    const toggleModules = () => {
      setExpandedModules(!expandedModules);
    };
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex h-screen w-full items-start",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {/* Sidebar */}
        <div
          className={`flex overflow-y-auto overflow-x-hidden h-full flex-col bg-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-[60px] fixed left-0 top-0 z-50" : "w-[280px] relative border-r border-neutral-200"
            }`}
        >
          {/* Collapse/Expand Button */}
          <div className="flex justify-center p-3 border-b border-neutral-200">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <FeatherMenu className="w-5 h-5 text-neutral-600" />
              ) : (
                <FeatherChevronLeft className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          </div>

          {!isCollapsed ? (
            <>
              {/* Header with user profile */}
              <div className="flex flex-col gap-5 p-6 border-b border-neutral-200">
                {/* Profile name and info - Moved to top */}


                {/* Tabs */}
                {/* <div className="flex gap-2">
                <button className="px-3 py-1.5 text-[13px] font-medium text-white bg-blue-600 rounded-full">
                  Overview
                </button>
                <button className="px-3 py-1.5 text-[13px] font-medium text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                  Campus
                </button>
                <button className="px-3 py-1.5 text-[13px] font-medium text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                  Startups
                </button>
              </div> */}

                {/* Profile images */}
                <div className="flex gap-2">
                  <div className="w-full aspect-square rounded-xl overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                      alt="Profile 1"
                      width={256}
                      height={256}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* <div className="w-[110px] h-[110px] rounded-xl overflow-hidden bg-cyan-400">
                  <div className="w-full h-full" />
                </div> */}
                </div>


                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[16px] font-semibold text-neutral-900 leading-tight">
                        Lloyd Percy
                      </h2>
                      <p className="text-[12px] text-neutral-900 leading-tight flex items-center gap-1"> Digital Marketing | UON
                        <svg className="w-6 h-6" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                          <rect width="60" height="30" fill="#012169" />
                          <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6" />
                          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="polygon(0 0, 60 0, 60 30, 0 30)" />
                          <rect y="12" width="60" height="6" fill="white" />
                          <rect x="24" width="12" height="30" fill="white" />
                          <rect y="12" width="60" height="4" fill="#C8102E" />
                          <rect x="26" width="8" height="30" fill="#C8102E" />
                        </svg>
                      </p>

                    </div>

                    {/* Three dots menu */}
                    <button className="p-1 hover:bg-neutral-100 rounded transition-colors">
                      <svg
                        className="w-4 h-4 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className={`text-[13px] text-neutral-400 leading-[1.6] ${isExpandedBio ? '' : 'line-clamp-3'}`}>
                    UK-based Nigerian Digital Marketing student with hands-on experience in website development and graphic design. Passionate about building strong online brands through data-driven marketing, creative visuals, and user-focused digital experiences. Constantly learning, experimenting, and delivering results in the evolving digital space.
                  </p>
                  <button
                    onClick={() => setIsExpandedBio(!isExpandedBio)}
                    className="text-[13px] text-gray-300 font-medium hover:text-blue-700 transition-colors mt-2"
                  >
                    {isExpandedBio ? 'View Less' : 'View More'}
                  </button>
                </div>
              </div>

              {/* Action items */}
              <div className="flex-1 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => router.push("/?new=true")}
                    className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <FeatherPlusCircle className="w-[18px] h-[18px] text-neutral-600" />
                    <span>Add New</span>
                  </button>

                  <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                    <FeatherUsers className="w-[18px] h-[18px] text-neutral-600" />
                    <span>Add Group</span>
                  </button>

                  {/* Add Modules with submenu */}
                  <div>
                    <button
                      onClick={toggleModules}
                      className="flex items-center justify-between w-full gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FeatherFolder className="w-[18px] h-[18px] text-neutral-600" />
                        <span>Add Modules</span>
                      </div>
                      <FeatherChevronDown
                        className={`w-4 h-4 text-neutral-600 transition-transform ${expandedModules ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Submenu items */}
                    {expandedModules && (
                      <div className="flex flex-col gap-0.5 mt-1 pl-6">
                        <button className="flex items-center gap-3 px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors text-left">
                          <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                          <span>MKT2006W1</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors text-left">
                          <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                          <span>MKT2050W</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 text-[13px] text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors text-left">
                          <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                          <span>MKT2011W</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                    <FeatherCalendar className="w-[18px] h-[18px] text-neutral-600" />
                    <span>Add Calendar</span>
                  </button>

                  <button
                    onClick={() => router.push("/notes")}
                    className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <FeatherClock className="w-[18px] h-[18px] text-neutral-600" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Collapsed state - show only menu icon at top */
            <div className="flex-1 flex items-start justify-center pt-4">
              {/* Content is hidden when collapsed */}
            </div>
          )}
        </div>

        {/* Main content area */}
        {children ? (
          <div className={`flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto bg-default-background transition-all duration-300 ease-in-out ${isCollapsed ? "ml-[60px]" : "ml-0"
            }`}>
            {children}
          </div>
        ) : null}
      </div>
    );
  });

export const MyLayout = DefaultPageLayoutRoot;