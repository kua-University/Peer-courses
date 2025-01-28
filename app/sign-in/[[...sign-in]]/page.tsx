//app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'
import React from 'react';

export default function Page()
{
    return (<div className="flex items-center justify-center h-screen">

        <SignIn />
    </div>
    )
}