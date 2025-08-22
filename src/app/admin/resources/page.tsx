"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ResourcesCard from "@/components/cards/ResourcesCard";
import { ResourceType } from "@/types/ResourceType";
import apiService from "@/utils/apiService";
import React, { useEffect, useState } from "react";

const resources = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);

  const getAll = () => {
    apiService.get("resources/all").then(function (response) {
      setResources(response.data.resource.reverse());
      console.log(response.data);
    });
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <p className="text-xl font-medium">Resources</p>

        <div className="flex justify-between flex-wrap">
          {resources.map((material) => (
            <ResourcesCard material={material} getAll={() => getAll()} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default resources;
