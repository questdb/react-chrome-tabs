import React, { useEffect } from "react";
import { useState } from "react";
import { render } from "react-dom";
import { Tabs } from "../src";
import { TabProperties } from "../src/chrome-tabs";
import "../css/chrome-tabs.css";
import "../css/chrome-tabs-dark-theme.css";
import "./css/demo.css";

import fb from "./images/facebook-favicon.ico";
import google from "./images/google-favicon.ico";

let id = 0;
function App() {
  const [tabs, setTabs] = useState<TabProperties[]>([
    { id: "abc", favicon: fb, title: "测试", active: true },
  ]);
  const [darkMode, setDarkMode] = useState(false);

  const addTabWithIcon = () => {
    id++;
    setTabs([
      ...tabs,
      {
        id: `tab-id-${id}`,
        title: `New Tabs ${id}`,
        favicon: tabs.length % 2 ? fb : google,
      },
    ]);
  };

  const addTabWithIconClass = () => {
    id++;
    setTabs([
      ...tabs,
      {
        id: `tab-id-${id}`,
        title: `New Tabs ${id}`,
        faviconClass: " emoji",
      },
    ]);
  };

  const active = (id: string) => {
    setTabs(tabs.map((tab) => ({ ...tab, active: id === tab.id })));
  };

  const close = (id: string) => {
    setTabs(tabs.filter((tab) => tab.id !== id));
  };

  const reorder = (tabId: string, fromIndex: number, toIndex: number) => {
    const beforeTab = tabs.find((tab) => tab.id === tabId);
    if (!beforeTab) {
      return;
    }
    let newTabs = tabs.filter((tab) => tab.id !== tabId);
    newTabs.splice(toIndex, 0, beforeTab);
    setTabs(newTabs);
  };

  const closeAll = () => setTabs([]);

  const toggleDarkMode = () => {
    setDarkMode((darkMode) => !darkMode);
  };

  const newTab = () => {
    setTabs([
      ...tabs.map((x) => ({ ...x, active: false })),
      { id: `${Math.random()}`, title: "New tab", active: true },
    ]);
  };

  return (
    <div>
      <Tabs
        darkMode={darkMode}
        onTabClose={close}
        onTabReorder={reorder}
        onTabActive={active}
        onNewTab={newTab}
        tabs={tabs}
      ></Tabs>
      <button onClick={addTabWithIcon}>Add Tab with icon</button>
      <button onClick={addTabWithIconClass}>Add Tab with iconClass</button>
      <button onClick={closeAll}>Close All</button>
      <button onClick={toggleDarkMode}>Dark Mode</button>
    </div>
  );
}

render(<App />, document.getElementById("root"));
