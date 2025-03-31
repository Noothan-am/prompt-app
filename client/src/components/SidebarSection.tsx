import React from "react";

interface SidebarItem {
  id: number;
  subreddit: string;
  title: string;
  upvotes: number;
  comments: number;
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
}

function SidebarSection({ title, items }: SidebarSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden mt-2">
      <h2 className="text-lg font-medium p-4 border-b">{title}</h2>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <span className="font-medium text-xs text-blue-500">
                {item.subreddit}
              </span>
            </div>
            <h3 className="font-medium text-sm mb-2">{item.title}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <div className="flex items-center mr-4">
                <span>{item.upvotes} upvotes</span>
              </div>
              <div className="flex items-center">
                <span>{item.comments} comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t">
        <button className="text-blue-500 text-sm font-medium">Show more</button>
      </div>
    </div>
  );
}

export default SidebarSection;
