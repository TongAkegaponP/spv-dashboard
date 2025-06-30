'use client';

import React from 'react';
import Head from 'next/head';
// import Navbar from '@/components/Navbar'; // Navbar can be part of a layout or imported here if needed
// import Dashboard from '@/components/Dashboard'; // Import the new Dashboard component
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard | Swarovski OEE</title>
        <meta
          name="description"
          content="Main OEE Dashboard for Swarovski Machine Utilization"
        />
      </Head>
      <>
        <Dashboard />
      </>
    </>
  );
}