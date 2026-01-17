"use client";

import React, { useState } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
        className={`flex overflow-y-auto overflow-x-hidden h-full flex-col bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[60px]" : "w-[280px]"
        }`}
      >
        {/* Collapse/Expand Button */}
        <div className="flex justify-end p-3 border-b border-neutral-200">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FeatherChevronRight className="w-5 h-5 text-neutral-600" />
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
                <div className="w-[110px] h-[110px] rounded-xl overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                    alt="Profile 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* <div className="w-[110px] h-[110px] rounded-xl overflow-hidden bg-cyan-400">
                  <div className="w-full h-full" />
                </div> */}
              </div>

              {/* Course and Year cards - Side by side */}
              <div className="flex gap-2">
                {/* Course card */}
                {/* <div className="flex-1 bg-neutral-50 rounded-lg p-3">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">
                    Course
                  </p>
                  <p className="text-[14px] font-semibold text-neutral-900 leading-tight">
                    Digital Marketing
                  </p>
                </div> */}

                {/* Year card */}
                {/* <div className="flex-1 bg-neutral-50 rounded-lg p-3">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1.5">
                    Year
                  </p>
                  <p className="text-[14px] font-semibold text-neutral-900 leading-tight">
                    Year 2 · <span className="text-neutral-400 font-medium">NG</span>
                  </p>
                </div> */}
              </div>

                <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[16px] font-semibold text-neutral-900 leading-tight">
                      Lloyd Percy
                    </h2>
                    {/* <p className="text-[13px] text-neutral-400 mt-1">
                      Digital Marketing · Year 2
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      NG · iKampus
                    </p> */}
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
              <p className="text-[13px] text-neutral-400 leading-[1.6]">
                Campus creator, digital storyteller and community builder at iKampus. Always exploring new projects and collabs.
              </p>
            </div>

            {/* Action items */}
            <div className="flex-1 p-4">
              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                  <FeatherPlusCircle className="w-[18px] h-[18px] text-neutral-600" />
                  <span>Add New</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                  <FeatherUsers className="w-[18px] h-[18px] text-neutral-600" />
                  <span>Add Group</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                  <FeatherFolder className="w-[18px] h-[18px] text-neutral-600" />
                  <span>Add Modules</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                  <FeatherCalendar className="w-[18px] h-[18px] text-neutral-600" />
                  <span>Add Calendar</span>
                </button>

                <button className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                  <FeatherClock className="w-[18px] h-[18px] text-neutral-600" />
                  <span>Add Note</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Collapsed state - show only icons */
          <div className="flex-1 p-2 mt-4">
            <div className="flex flex-col gap-2 items-center">
              <button
                className="p-3 hover:bg-neutral-100 rounded-lg transition-colors w-full flex justify-center"
                title="Add New"
              >
                <FeatherPlusCircle className="w-5 h-5 text-neutral-600" />
              </button>

              <button
                className="p-3 hover:bg-neutral-100 rounded-lg transition-colors w-full flex justify-center"
                title="Add Group"
              >
                <FeatherUsers className="w-5 h-5 text-neutral-600" />
              </button>

              <button
                className="p-3 hover:bg-neutral-100 rounded-lg transition-colors w-full flex justify-center"
                title="Add Project"
              >
                <FeatherFolder className="w-5 h-5 text-neutral-600" />
              </button>

              <button
                className="p-3 hover:bg-neutral-100 rounded-lg transition-colors w-full flex justify-center"
                title="Add Calendar"
              >
                <FeatherCalendar className="w-5 h-5 text-neutral-600" />
              </button>

              <button
                className="p-3 hover:bg-neutral-100 rounded-lg transition-colors w-full flex justify-center"
                title="Add Timeline"
              >
                <FeatherClock className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const MyLayout = DefaultPageLayoutRoot;