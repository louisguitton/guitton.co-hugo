import { FC } from "react";
import React from "react";

export const Button: FC<{ title: string }> = ({ title }) => (
  <div
    className="inline-block p-2 text-white bg-gray-700 rounded"
    onClick={() => alert("Hi")}>
    {title}
  </div>
);
