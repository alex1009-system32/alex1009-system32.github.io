import { useState } from "react";

function Header() {
  const [currentDate] = useState(new Date().toLocaleDateString());

  const [currentStatus] = useState("Placehoulder");
  const [currentLocation] = useState("Placehoulder");

  return (
    <>
      <div className="flex justify-between font-mono uppercase">
        <div>
          <div>Date: {currentDate}</div>
          <div>Status: {currentStatus}</div>
        </div>
        <div>Loc: {currentLocation}</div>
      </div>
      <div className="flex justify-between">
        <div>
          <div>Alex Kerschbamer</div>
          <div>Working on Private Porjects</div>
        </div>
        <div>/* Image */</div>
      </div>
      <div className="border-2 border-sand-900 border-dashed h-0" />
    </>
  );
}

export default Header;
