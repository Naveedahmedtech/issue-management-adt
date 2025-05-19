import React, { useState } from "react";
import Tabs from "../Tabs";
import Table from "../Table";
import DocumentsCardList from "./DocumentsCardList";

interface DocumentsProps {
  projectColumns: any;
  projectData: any[];
  isLoading: boolean;
  orderColumns: any;
  orderData: any[];
  isOrderProject: boolean;
}

const Documents: React.FC<DocumentsProps> = ({
  projectColumns,
  projectData,
  isLoading,
  orderColumns,
  orderData,
  isOrderProject
}) => {
  // 1) Track which tab is active
  const [activeTab, setActiveTab] = useState<"project" | "order">("project");

  // 2) Define your two tabs
  const tabs = [
    { id: "project", label: "Project Files" },
    { id: "order", label: "Order Files" },
  ];

  const handleTabChange = (tabId: string) => {
    // narrow string → our union
    if (tabId === "project" || tabId === "order") {
      setActiveTab(tabId);
    }
  };


  const columns = activeTab === "project" ? projectColumns : orderColumns;
  const data = activeTab === "project" ? projectData : orderData;
  console.log('projectData', projectData, orderData)
  return (
    <div className="bg-background min-h-screen">
      {
        isOrderProject &&
        < Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      }

      {/* Content for the selected tab */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-primary text-lg font-semibold">
            Loading {activeTab === "project" ? "project" : "order"} files...
          </div>
        </div>
      ) : data.length > 0 ? (
        <>
          {/* Desktop view */}
          <div className="hidden md:block w-full">
            <Table columns={columns} data={data} />
          </div>
          {/* Mobile view */}
          <div className="block md:hidden w-full">
            <DocumentsCardList columns={columns} data={data} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-textLight text-lg font-medium">
            No {activeTab === "project" ? "project" : "order"} files available.
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
