import React from "react";

export default function FiltersSidebar() {

return ( <div className="w-64 bg-zinc-900 p-6 rounded-xl text-white h-fit">

  <h2 className="text-xl font-semibold mb-6">
    Filters
  </h2>

  <div className="mb-6">

    <h3 className="text-gray-400 mb-2">
      Brand
    </h3>

    <label className="block mb-1">
      <input type="checkbox" className="mr-2" />
      Apple
    </label>

    <label className="block mb-1">
      <input type="checkbox" className="mr-2" />
      Samsung
    </label>

    <label className="block">
      <input type="checkbox" className="mr-2" />
      Dell
    </label>

  </div>

  <div>

    <h3 className="text-gray-400 mb-2">
      Price Range
    </h3>

    <input
      type="range"
      className="w-full"
    />

  </div>

</div>


);
}
