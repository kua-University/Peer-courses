//app/pages/
import React from 'react';

import AddCourse from "@/components/addcourse";
import Navbar from "@/components/navbar";
//import Image from "next/image";

export default function Home()
{
  return (<div>
    <Navbar />
    <AddCourse />
  </div>

  );
}