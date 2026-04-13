import { useState } from "react";

function Header() {
  const [currentDate] = useState(new Date().toLocaleDateString());

  const [currentStatus] = useState("Placehoulder");
  const [currentLocation] = useState("Placehoulder");

  return (
    <>
      <div className="flex justify-between font-mono uppercase">
        <div className="text-lg text-gravel-500 selection:bg-wood-800">
          <div>Date: {currentDate}</div>
          <div>Status: {currentStatus}</div>
        </div>
        <div className="text-lg text-gravel-500 selection:bg-wood-800">
          Loc: {currentLocation}
        </div>
      </div>
      <div className="flex justify-between my-10">
        <div>
          <div className="m-3 text-5xl text-wood-950 font-bold">
            Alex Kerschbamer
          </div>
          <div className="m-3 text-2xl text-wood-800 selection:bg-wood-800">
            Working on Private Porjects
          </div>
        </div>
        <div>
          <img
            className="max-h-44 m-0 border-2 border-wood-950 outline rotate-3"
            src="https://avatars.githubusercontent.com/u/177112577?v=4"
          />
        </div>
      </div>
      <div className="border-2 border-sand-900 border-dashed h-0" />
    </>
  );
}

export default Header;
