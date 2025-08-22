"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ResourcesCard from "@/components/cards/ResourcesCard";
import { useAppSelector } from "@/store/hooks";
import { ResourceType } from "@/types/ResourceType";
import apiService from "@/utils/apiService";
import React, { useEffect, useState } from "react";

const resources = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const user = useAppSelector((state) => state.value);

  const getAll = () => {
    apiService.get(`resources/tutor/${user.id}`).then(function (response) {
      setResources(response.data.resources.reverse());
      console.log(response.data);
    });
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <p className="text-xl font-medium">Tutor Resources</p>

        {resources.length > 0 ? (
          <div className="flex justify-between flex-wrap">
            {resources.map((material) => (
              <ResourcesCard
                key={material._id}
                material={material}
                getAll={() => getAll()}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            {/* <img
              src="/images/unread.jpg"
              alt="No resources"
              className="mx-auto mb-4"
            /> */}
            <p className="text-gray-500">No resources found!</p>
            <p className="text-sm text-gray-400 mt-2">
              Start by adding your first resource.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default resources;
