
import bannerLocal from '../assets/cadf69f7-9630-4cc0-84a1-16dcdc98b640.png';
import Danhmuc1 from '../assets/Danhmuc1.png';
import Danhmuc2 from '../assets/Danhmuc2.png';
import Danhmuc3 from '../assets/Danhmuc3.jpg';
import Danhmuc4 from '../assets/Danhmuc4.png';
import Danhmuc5 from '../assets/Danhmuc5.png';
import Danhmuc6 from '../assets/Danhmuc6.png';
import Danhmuc7 from '../assets/Danhmuc7.png';
import Danhmuc8 from '../assets/Danhmuc8.png';
import Danhmuc9 from '../assets/Danhmuc9.png';
import Danhmuc10 from '../assets/Danhmuc10.png';
import Danhmuc11 from '../assets/Danhmuc11.png';
import Danhmuc12 from '../assets/Danhmuc12.png';


export const MOCK_BANNERS = [
  bannerLocal,
  "https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a_xxhdpi",
  "https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9ed60b4f_xxhdpi"
];

export const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Đồ chơi trẻ em",
    img: Danhmuc1
  },
  {
    id: 2,
    name: "Điện Thoại & Phụ Kiện",
    img: Danhmuc2
  },
  {
    id: 3,
    name: "Thiết Bị Điện Tử",
    img: Danhmuc3
  },
  {
    id: 4,
    name: "Máy Tính & Laptop",
    img: Danhmuc4
  },
  {
    id: 5,
    name: "Đồ Gia Dụng",
    img: Danhmuc5
  },
  {
    id: 6,
    name: "Phát Triển Trí Tuệ",
    img: Danhmuc6
  },
  {
    id: 7,
    name: "Phương Tiện",
    img: Danhmuc7
  },
  {
    id: 8,
    name: "Xếp Hình Thông Minh",
    img: Danhmuc8
  },{
    id: 9,
    name: "Thế Giới Xe",
    img: Danhmuc9
  },{
    id: 10,
    name: "Mô Hình Nhân Vật",
    img: Danhmuc10
  },
  {
    id: 11,
    name: "Búp Bê",
    img: Danhmuc11
  },
  {
    id: 12,
    name: "Board Game",
    img: Danhmuc12
  }
  
];
export const MOCK_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Điện Thoại iPhone 15 Pro Max 256GB - Hàng Chính Hãng VN/A",
  image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmk36f568g8b69",
  price: 25000000 + (i * 100000),
  discount: 10 + i,
  sold: 100 + i * 10
}));