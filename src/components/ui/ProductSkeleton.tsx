import React from "react";

const ProductSkeleton = () => {

return (


<div className="card border-obsidian-800 animate-pulse">

  <div className="h-56 bg-obsidian-800"/>

  <div className="p-4 space-y-3">

    <div className="h-4 bg-obsidian-700 w-2/3"/>

    <div className="h-3 bg-obsidian-700 w-full"/>

    <div className="h-3 bg-obsidian-700 w-1/2"/>

    <div className="h-6 bg-obsidian-700 w-24"/>

  </div>

</div>


);

};

export default ProductSkeleton;
