import React, { useCallback, useEffect, useRef, useState } from "react";
import { Listeners, useChromeTabs } from "./hooks";
import isEqual from "lodash.isequal";
import { TabProperties } from "./chrome-tabs";

export type TabsProps = Listeners & {
  tabs: TabProperties[];
  className?: string;
  darkMode?: boolean;
};

export function Tabs({
  tabs,
  className,
  darkMode,
  onTabActive,
  onTabClose,
  onTabReorder,
  onContextMenu,
  onNewTab,
}: TabsProps) {
  const tabsRef = useRef<TabProperties[]>([]);
  const moveIndex = useRef({ tabId: "", fromIndex: -1, toIndex: -1 });

  const handleTabReorder = useCallback(
    (tabId: string, fromIndex: number, toIndex: number) => {
      const [dest] = tabsRef.current.splice(fromIndex, 1);
      tabsRef.current.splice(toIndex, 0, dest);
      const beforeFromIndex = moveIndex.current.fromIndex;
      moveIndex.current = {
        tabId,
        fromIndex: beforeFromIndex > -1 ? beforeFromIndex : fromIndex,
        toIndex,
      };
    },
    []
  );
  const handleDragEnd = useCallback(() => {
    const { tabId, fromIndex, toIndex } = moveIndex.current;
    if (fromIndex > -1) {
      onTabReorder?.(tabId, fromIndex, toIndex);
    }
    moveIndex.current = {
      tabId: "",
      fromIndex: -1,
      toIndex: -1,
    };
  }, [onTabReorder]);

  const { ChromeTabs, addTab, activeTab, removeTab, updateTab } = useChromeTabs(
    {
      onTabClose,
      onTabActive,
      onContextMenu,
      onNewTab,
      onDragEnd: handleDragEnd,
      onTabReorder: handleTabReorder,
    }
  );

  useEffect(() => {
    if (!isEqual(tabsRef.current, tabs)) {
      const retainTabs = tabsRef.current.slice(tabs.length);
      retainTabs.forEach((tab) => {
        removeTab(tab.id);
      });

      (tabs as TabProperties[]).forEach((tab, index) => {
        const currentTab = tabsRef.current[index];
        if (!currentTab) {
          addTab(tab);
        } else {
          if (!isEqual(tab, currentTab)) {
            updateTab(currentTab.id, tab);
          }
        }
      });

      (tabs as TabProperties[]).forEach((tab) => {
        if (tab.active) {
          activeTab(tab.id);
        }
      });
    }
    tabsRef.current = tabs;
  }, [tabs]);

  return <ChromeTabs className={className} darkMode={darkMode} />;
}
