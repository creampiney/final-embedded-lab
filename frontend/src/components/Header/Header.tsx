import { useState, useEffect, useRef } from 'react'
import { getStatus } from '../NETPIE/DataFetcher'
import { Link } from "react-router-dom"

import logoOffline from "../../resources/logo/logoSpring.svg"
import logoOnline from "../../resources/logo/logoWinter.svg"
import token from "../NETPIE/token.json"

function Header() {

    const dataFetchedRef = useRef(false);

    const [deviceStatus, setDeviceStatus] = useState<boolean>(false);

    useEffect(() => {
      if (!dataFetchedRef.current) {
        fetch('https://api.netpie.io/v2/device/status', {method : 'GET',
        headers : {
            "Authorization" : `${token.auth}`,
        }}).then((response) => response.json())
        .then((jsonData) => setDeviceStatus((jsonData.status == 1) ? true : false))
        dataFetchedRef.current = true;
        console.log("set initial status")
      }
        
      const interval = setInterval(async () => {
        setDeviceStatus(await getStatus());
      }, 30000);
      return () => clearInterval(interval);
    }, []);

    return (
        <nav className="bg-white px-2 sm:px-4 py-2 sticky w-full z-20 top-0 left-0 border-b border-gray-200">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
            <a href="#" className="ml-2 md:ml-0 flex items-center">
                <img src={(deviceStatus) ? logoOnline : logoOffline} className="h-6 mr-3 sm:h-9" alt="Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap">Status : {(deviceStatus) ? "Online" : "Offline"}</span>
            </a>
            <div className="items-center justify-between flex w-auto order-1" id="navbar-sticky">
              <ul className="flex flex-row p-4 rounded-lg bg-white space-x-4 md:space-x-8 mt-0 text-sm font-medium">
                <li>
                  <Link to="/dust" className="block hover:text-sky-500 rounded">Dust</Link>
                </li>
                <li>
                  <Link to="/temperature" className="block hover:text-sky-500 rounded">Temperature</Link>
                </li>
                <li>
                  <Link to="/humidity" className="block hover:text-sky-500 rounded">Humidity</Link>
                </li>
              </ul>
            </div>
            </div>
        </nav>
    )
}

export default Header