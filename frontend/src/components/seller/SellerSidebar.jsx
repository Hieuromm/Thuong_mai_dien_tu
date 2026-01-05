import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBox, FaClipboardList, FaChartLine, FaStore } from 'react-icons/fa';

const MENU_ITEMS = [
  {
    title: 'Quản Lý Đơn Hàng',
    icon: <FaClipboardList />,
    path: '/seller/orders',
  },
  {
    title: 'Quản Lý Sản Phẩm',
    icon: <FaBox />,
    items: ['Tất cả Sản Phẩm', 'Thêm Sản Phẩm']
  },
  {
    title: 'Dữ Liệu',
    icon: <FaChartLine />,
    items: ['Phân Tích Bán Hàng', 'Doanh Số', 'Truy Cập']
  },
  {
    title: 'Quản Lý Shop',
    icon: <FaStore />,
    items: ['Hồ Sơ Shop', 'Trang Trí Shop', 'Danh Mục Của Shop', 'Top Sản Phẩm Nổi Bật']
  },
];

const SellerSidebar = () => {
 
  const [openMenus, setOpenMenus] = useState(
    MENU_ITEMS.map((menu, i) => (menu.items ? i : null)).filter(i => i !== null)
  );

  const location = useLocation();

  const toggleMenu = (index, hasItems) => {
    if (!hasItems) return; 
    if (openMenus.includes(index)) {
      setOpenMenus(openMenus.filter(i => i !== index));
    } else {
      setOpenMenus([...openMenus, index]);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white min-h-screen shadow-sm border-r border-gray-200 flex-shrink-0 text-sm overflow-y-auto pb-10 z-10 relative">
      <div className="p-4 font-bold text-gray-700 text-lg flex items-center gap-2 border-b border-gray-100">
        <Link to="/seller/" className="hover:opacity-80">Kênh người bán</Link>
      </div>
      <ul>
        {MENU_ITEMS.map((menu, index) => {
          const hasItems = menu.items && menu.items.length > 0;
          const isParentActive = menu.path && isActive(menu.path);

          return (
            <li key={index} className="border-b border-gray-50 last:border-none">
          
              {menu.path ? (
                <Link
                  to={menu.path}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors
                    ${isParentActive ? 'text-[#ee4d2d] bg-gray-50' : 'text-gray-700 font-medium'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isParentActive ? 'text-[#ee4d2d]' : 'text-gray-400'} text-base`}>
                      {menu.icon}
                    </span>
                    <span>{menu.title}</span>
                  </div>
                </Link>
              ) : (
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  onClick={() => toggleMenu(index, hasItems)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-base">{menu.icon}</span>
                    <span>{menu.title}</span>
                  </div>
                  {hasItems && (
                    <span className={`text-[10px] text-gray-400 transform transition-transform duration-200 ${openMenus.includes(index) ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  )}
                </div>
              )}

              {hasItems && openMenus.includes(index) && (
                <ul className="bg-white pb-2 animate-fadeIn">
                  {menu.items.map((item, subIndex) => {
                    let subPath = null;
                    if (item === 'Tất cả Sản Phẩm') subPath = '/seller/products/list';
                    else if (item === 'Thêm Sản Phẩm') subPath = '/seller/products/add';
                    else if (item === 'Phân Tích Bán Hàng') subPath = '/seller/analytics';
                    else if (item === 'Doanh Số') subPath = '/seller/analytics/sales';
                    else if (item === 'Truy Cập') subPath = '/seller/analytics/traffic';
                    else if (item === 'Hồ Sơ Shop') subPath = '/seller/shop/profile';
                    else if (item === 'Trang Trí Shop') subPath = '/seller/shop/decoration';
                    else if (item === 'Danh Mục Của Shop') subPath = '/seller/shop/category';
                    else if (item === 'Top Sản Phẩm Nổi Bật') subPath = '/seller/shop/top-products';

                    const isSubActive = subPath && isActive(subPath);

                    return (
                      <li key={subIndex} className="pl-11 pr-4 py-2 text-[13px]">
                        {subPath ? (
                          <Link
                            to={subPath}
                            className={`block w-full h-full transition-colors ${isSubActive ? 'text-[#ee4d2d] font-medium' : 'text-gray-500 hover:text-[#ee4d2d]'}`}
                          >
                            {item}
                          </Link>
                        ) : (
                          <span className="text-gray-500">{item}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SellerSidebar;