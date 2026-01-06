
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../../stack/client";
import Provider from "../provider";
import React from "react";
import AppHeader from "../(main)/_components/AppHeader";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <StackProvider app={stackClientApp}>
        <StackTheme>
          <Provider>
            <AppHeader />
            <div className="p-10 mt-14 md:px-20 lg:px-32 xl:px-56 2xl:px-72">
              {children}
            </div>
          </Provider>
        </StackTheme>
      </StackProvider>
    </div>
  );
};

export default DashboardLayout;
