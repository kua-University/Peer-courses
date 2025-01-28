"use client";
import React from 'react';

export default function courselayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (

    <div> {children}</div>
  );
}