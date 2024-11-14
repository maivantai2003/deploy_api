const API_URL="http://vantai1234-001-site1.ltempurl.com/api"
const HUB="http://vantai1234-001-site1.ltempurl.com/hub"
const API_ENDPOINTS = {
    NHAVIEN:`${API_URL}/NhanVien`,
    PHONGBAN:`${API_URL}/PhongBan`,
    TAIKHOAN:`${API_URL}/TaiKhoan`,
    CONGVIEC:`${API_URL}/CongViec`,
    CONGVIECPHONGBAN:`${API_URL}/CongViecPhongBan`,
    CHUCNANG:`${API_URL}/ChucNang`,
    NHOMQUYEN:`${API_URL}/NhomQuyen`,
    CHITIETQUYEN:`${API_URL}/ChiTietQuyen`,
    DUAN:`${API_URL}/DuAn`,
    PHANDUAN:`${API_URL}/PhanDuAn`,
    PHANCONG:`${API_URL}/PhanCong`,
    AUTH:`${API_URL}/Authentication/`,
    SENDGMAIL:`${API_URL}/SendGmail`,
    LICHSUCONGVIEC:`${API_URL}/LichSuCongViec`,
    FILES:`${API_URL}/Files`,
    CHITIETFILE:`${API_URL}/ChiTietFile`,
    HUB_URL:HUB,
    URL:API_URL
};
export default API_ENDPOINTS;