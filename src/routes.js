import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdTroubleshoot,
  MdHistory,
  MdVisibility,
  MdUpload,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";
import BacktestRecords from "views/nt/backtestRecords";
import Home from "views/nt/home";
import TradeHistory from "views/nt/tradeHistory";
import WatchList from "views/nt/watchList";
import UploadBacktest from "views/nt/uploadBacktest";


// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Home",
    layout: "/admin",
    path: "/home",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: Home,
  },
  {
    name: "Backtest Records",
    layout: "/admin",
    path: "/backtest-records",
    icon: <Icon as={MdTroubleshoot} width='20px' height='20px' color='inherit' />,
    component: BacktestRecords,
  },
  {
    name: "Upload Backtest",
    layout: "/admin",
    path: "/upload-backtest",
    icon: <Icon as={MdUpload} width='20px' height='20px' color='inherit' />,
    component: UploadBacktest,
  },
  {
    name: "Trade History",
    layout: "/admin",
    path: "/trade-history",
    icon: <Icon as={MdHistory} width='20px' height='20px' color='inherit' />,
    component: TradeHistory,
  },
  {
    name: "Watch List",
    layout: "/admin",
    path: "/watch-list",
    icon: <Icon as={MdVisibility} width='20px' height='20px' color='inherit' />,
    component: WatchList,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/data-tables",
    component: DataTables,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "/rtl-default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: RTL,
  },
];

export default routes;
