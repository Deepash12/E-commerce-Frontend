
import React from "react";

export default function ProductToolbar() {

return ( <div className="flex justify-between items-center mb-8">

  <input
    type="text"
    placeholder="Search products..."
    className="bg-zinc-900 px-4 py-2 rounded w-72 text-white"
  />

  <select className="bg-zinc-900 px-4 py-2 rounded text-white">

    <option>Default</option>
    <option>Price Low → High</option>
    <option>Price High → Low</option>
    <option>Newest</option>

  </select>

</div>


);
}
