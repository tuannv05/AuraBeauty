import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, FileText, CheckCircle2, Award, Clock,
  Truck, RotateCcw, Lock, Store, DollarSign, BookOpen,
  Code2, ExternalLink, HelpCircle, Briefcase, ChevronRight
} from 'lucide-react';
import { MotionCard, AnimatedBadge, SpringButton } from './ui';

export function FooterInfoModal({
  articleSlug, // 'gioi-thieu' | 'quy-che' | 'cam-ket-200' | 'tuyen-dung' | 'huong-dan-mua-hang' | 'chinh-sach-doi-tra' | 'van-chuyen-2h' | 'bao-mat-cookie' | 'mo-gian-hang' | 'bieu-phi-hoa-hong' | 'cam-nang-ban-hang' | 'api-kho-van' | 'bo-cong-thuong' | 'pci-dss' | 'faq' | null
  onClose,
  onOpenSellerRegistration
}) {
  if (!articleSlug) return null;

  const ARTICLES = {
    'gioi-thieu': {
      title: 'Giới Thiệu Về Aura Beauty Mall',
      subtitle: 'Sàn Thương Mại Điện Tử Mỹ Phẩm Đa Người Bán & AI Da Liễu Hàng Đầu',
      icon: Award,
      content: (
        <div>
          <p style={{ lineHeight: 1.7, color: '#334155', marginBottom: '14px' }}>
            <strong>Aura Beauty Mall (WebBanMP)</strong> là nền tảng thương mại điện tử chuyên biệt về mỹ phẩm và chăm sóc sắc đẹp chính hãng, tiên phong tại Việt Nam ứng dụng trí tuệ nhân tạo (AI RAG) và thực tế ảo AR trong tư vấn da liễu.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '16px 0' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#ec4899', display: 'block', marginBottom: '4px' }}>🎯 Sứ Mệnh</strong>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>Mang mỹ phẩm chính hãng có số CBMP chuẩn Bộ Y Tế và kiến thức da liễu khoa học tới mọi khách hàng.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0ea5e9', display: 'block', marginBottom: '4px' }}>💎 Tầm Nhìn</strong>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>Trở thành hệ sinh thái Beauty-Tech toàn diện nhất Đông Nam Á với hơn 500+ thương hiệu cao cấp.</p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
            Doanh nghiệp: Công ty Cổ phần Công nghệ Làm đẹp Aura Beauty Việt Nam.<br />
            Mã số doanh nghiệp: 0108923482 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp ngày 15/03/2024.
          </p>
        </div>
      )
    },
    'quy-che': {
      title: 'Quy Chế Hoạt Động & Tiêu Chuẩn CBMP',
      subtitle: 'Quy Chuẩn Thẩm Định Mỹ Phẩm Hợp Chuẩn ASEAN & Bộ Y Tế',
      icon: FileText,
      content: (
        <div>
          <p style={{ lineHeight: 1.6, color: '#334155', marginBottom: '14px' }}>
            Tất cả các gian hàng kinh doanh trên Aura Beauty Mall bắt buộc phải tuân thủ nghiêm ngặt Quy chế Quản lý Mỹ phẩm theo Thông tư 06/2011/TT-BYT và Hiệp định Mỹ phẩm ASEAN:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.7, color: '#475569', fontSize: '13px', marginBottom: '16px' }}>
            <li><strong>Giấy Công Bố Mỹ Phẩm (CBMP):</strong> 100% sản phẩm bày bán phải có số tiếp nhận Phiếu công bố sản phẩm mỹ phẩm do Cục Quản lý Dược hoặc Sở Y Tế cấp còn hiệu lực.</li>
            <li><strong>Nhãn phụ tiếng Việt:</strong> Bắt buộc có thông tin đơn vị nhập khẩu, thành phần công thức chuẩn quốc tế INCI, số lô sản xuất, hạn sử dụng rõ ràng.</li>
            <li><strong>Chặn hoàn toàn chất cấm:</strong> Hệ thống AI INCI Scanner tự động rà soát và chặn đứng các sản phẩm chứa Corticoid, Thủy ngân, Hydroquinone vượt ngưỡng.</li>
          </ul>
        </div>
      )
    },
    'cam-ket-200': {
      title: 'Cam Kết 100% Chính Hãng & Đền Bù 200%',
      subtitle: 'Chính Sách Bảo Vệ Quyền Lợi Người Mua Hàng Cao Nhất Thị Trường',
      icon: ShieldCheck,
      content: (
        <div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <h5 style={{ color: '#dc2626', fontWeight: 800, margin: '0 0 6px 0', fontSize: '14px' }}>CHÍNH SÁCH BỒI THƯỜNG 200%</h5>
            <p style={{ fontSize: '13px', color: '#991b1b', margin: 0, lineHeight: 1.6 }}>
              Aura Beauty Mall cam kết đền bù gấp đôi giá trị đơn hàng (hoàn 100% tiền mua + bồi thường thêm 100% bằng tiền mặt) nếu bất kỳ sản phẩm nào mua trên sàn bị giám định là hàng giả, hàng nhái, hoặc hàng cận date không đạt tiêu chuẩn.
            </p>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            Quỹ bảo chứng chất lượng trị giá 10 tỷ đồng được ký quỹ độc lập tại Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) đảm bảo giải ngân ngay khi có kết luận giám định từ cơ quan quản lý thị trường hoặc đại diện chính hãng.
          </p>
        </div>
      )
    },
    'tuyen-dung': {
      title: 'Tuyển Dụng & Gia Nhập Đội Ngũ Aura Beauty',
      subtitle: 'Xây Dựng Tương Lai Của Ngành Beauty-Tech Tại Việt Nam',
      icon: Briefcase,
      content: (
        <div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Chúng tôi luôn tìm kiếm những tài năng đam mê công nghệ và vẻ đẹp để cùng nhau bứt phá:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {[
              { pos: 'Senior AI Engineer (Computer Vision & VTO)', dept: 'Khối Công Nghệ', loc: 'TP.HCM / Remote' },
              { pos: 'Chuyên Viên Thẩm Định Bảng Thành Phần INCI', dept: 'Khối Y Khoa & Dược Phẩm', loc: 'TP.HCM' },
              { pos: 'Key Account Manager (Thương Hiệu Mall)', dept: 'Khối Kinh Doanh Sàn', loc: 'Hà Nội / TP.HCM' }
            ].map((j, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{j.pos}</strong>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{j.dept} • {j.loc}</div>
                </div>
                <a href="mailto:careers@aurabeauty.vn" className="btn-pill-primary" style={{ fontSize: '11.5px', padding: '5px 14px' }}>Ứng tuyển</a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748b' }}>Gửi CV trực tiếp về: <code>careers@aurabeauty.vn</code> (Tiêu đề: [Vị trí] - [Họ và tên])</p>
        </div>
      )
    },
    'huong-dan-mua-hang': {
      title: 'Hướng Dẫn Mua Hàng & Chọn Shade Màu Son / Phấn',
      subtitle: 'Quy Trình Mua Sắm Chuẩn Khoa Học & Trải Nghiệm Thử Màu AR',
      icon: BookOpen,
      content: (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a' }}>Bước 1: Tìm kiếm & Lọc theo Da Liễu</strong>
              <p style={{ margin: '4px 0 0 0' }}>Sử dụng bộ lọc 8 phân hệ Facet Search (Loại da Oily/Dry, Vấn đề mụn/thâm, Hoạt chất INCI) để chọn sản phẩm chuẩn cho làn da của bạn.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a' }}>Bước 2: Bấm "Thử Màu AR (VTO)" để chọn đúng Shade</strong>
              <p style={{ margin: '4px 0 0 0' }}>Bật camera trên điện thoại hoặc máy tính để son hoặc phấn nền hiển thị chân thực 1:1 trên khuôn mặt bạn trước khi quyết định đặt hàng.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a' }}>Bước 3: Thanh Toán An Toàn Qua Ký Quỹ Escrow</strong>
              <p style={{ margin: '4px 0 0 0' }}>Chọn thanh toán COD hoặc trực tuyến qua VietQR/Visa/MoMo. Tiền của bạn được giữ an toàn trên tài khoản Escrow cho tới khi bạn nhận và kiểm tra hàng hài lòng.</p>
            </div>
          </div>
        </div>
      )
    },
    'chinh-sach-doi-tra': {
      title: 'Chính Sách Đổi Trả & Hoàn Tiền Trong 7 Ngày',
      subtitle: 'Miễn Phí Đổi Trả Tận Nhà Nếu Kích Ứng Hoặc Lỗi Vận Chuyển',
      icon: RotateCcw,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Aura Beauty Mall áp dụng chính sách đổi trả hàng linh hoạt trong vòng <strong>7 ngày kể từ khi nhận hàng</strong>:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.7, color: '#475569', fontSize: '13px', marginBottom: '16px' }}>
            <li><strong>Đổi trả do kích ứng:</strong> Khách hàng có dấu hiệu dị ứng da được hỗ trợ trả hàng hoàn tiền 100% kèm hướng dẫn phục hồi từ Bác sĩ da liễu của sàn.</li>
            <li><strong>Lỗi sản phẩm / Vận chuyển:</strong> Hàng bị móp méo hộp, vỡ nắp, rách seal niêm phong hoặc sai phân loại màu sắc được đổi mới hỏa tốc 2H hoàn toàn miễn phí.</li>
            <li><strong>Đơn vị thu hồi tận nơi:</strong> Shipper đến tận địa chỉ của bạn lấy lại hàng, bạn không cần phải mang ra bưu cục.</li>
          </ul>
        </div>
      )
    },
    'van-chuyen-2h': {
      title: 'Chính Sách Giao Hàng Hỏa Tốc 2H & Tiêu Chuẩn Đóng Gói',
      subtitle: 'Kho Đa Điểm Bắc - Trung - Nam Bảo Quản Mỹ Phẩm Nhiệt Độ Chuẩn 22°C',
      icon: Truck,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Hệ thống kho đa điểm tại Hà Nội, Đà Nẵng và TP.HCM giúp đơn hàng được giao nhanh nhất với chi phí thấp nhất:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '14px 0' }}>
            <div style={{ background: '#fdf2f8', padding: '14px', borderRadius: '12px', border: '1px solid #fbcfe8' }}>
              <strong style={{ color: '#ec4899', display: 'block', marginBottom: '4px' }}>⚡ Giao Hỏa Tốc 2 Giờ</strong>
              <p style={{ fontSize: '12.5px', color: '#475569', margin: 0 }}>Áp dụng nội thành Hà Nội & TP.HCM từ 8h00 - 20h00 hàng ngày.</p>
            </div>
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>📦 Đóng Gói Chống Nhiệt</strong>
              <p style={{ fontSize: '12.5px', color: '#475569', margin: 0 }}>Hộp carton 3 lớp chèn túi khí bọt xốp bảo vệ hoạt chất Retinol & Vitamin C không bị oxy hóa.</p>
            </div>
          </div>
        </div>
      )
    },
    'bao-mat-cookie': {
      title: 'Chính Sách Bảo Mật Thông Tin & Cookie',
      subtitle: 'Tuân Thủ Nghị Định 13/2023/NĐ-CP Về Bảo Vệ Dữ Liệu Cá Nhân',
      icon: Lock,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Aura Beauty Mall cam kết bảo mật tuyệt đối dữ liệu sinh trắc học khuôn mặt từ tính năng Virtual Try-On và hồ sơ tình trạng da liễu của người dùng:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.7, color: '#475569', fontSize: '13px' }}>
            <li><strong>Dữ liệu khuôn mặt AR:</strong> Thuật toán MediaPipe xử lý 468 điểm mốc hoàn toàn trực tiếp trên trình duyệt (Client-side), không truyền video hay hình ảnh khuôn mặt về máy chủ.</li>
            <li><strong>Mã hóa chuẩn PCI-DSS:</strong> Thông tin thanh toán và thẻ ngân hàng được mã hóa tokenization 256-bit, không lưu trữ mã CVV/CVC.</li>
            <li><strong>Quyền kiểm soát của người dùng:</strong> Bạn có toàn quyền xem, xuất hoặc yêu cầu xóa vĩnh viễn hồ sơ da liễu trong mục Cài Đặt Tài Khoản.</li>
          </ul>
        </div>
      )
    },
    'mo-gian-hang': {
      title: 'Đăng Ký Mở Gian Hàng Official Mall',
      subtitle: 'Tiếp Cận Hơn 500.000+ Khách Hàng Mỹ Phẩm Cao Cấp',
      icon: Store,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Aura Beauty Mall chào đón các thương hiệu mỹ phẩm chính hãng, đại lý ủy quyền và xưởng sản xuất chuẩn CGMP mở gian hàng kinh doanh với những quyền lợi độc quyền:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.7, color: '#475569', fontSize: '13px', marginBottom: '18px' }}>
            <li>Cấp huy hiệu <strong>OFFICIAL MALL</strong> chính thức bảo chứng uy tín.</li>
            <li>Hỗ trợ tích hợp công nghệ thử màu ảo AR cho toàn bộ bảng màu son và phấn của hãng.</li>
            <li>Định tuyến thông minh kho bãi Smart Routing và đối soát dòng tiền tự động qua Sổ cái kép.</li>
          </ul>
          <div style={{ display: 'flex', gap: '10px' }}>
            <SpringButton
              variant="rose"
              onClick={() => {
                onClose();
                if (onOpenSellerRegistration) onOpenSellerRegistration();
              }}
            >
              Đăng Ký Gian Hàng Ngay <ChevronRight size={16} />
            </SpringButton>
          </div>
        </div>
      )
    },
    'bieu-phi-hoa-hong': {
      title: 'Quy Định & Biểu Phí Hoa Hồng Sàn (10%)',
      subtitle: 'Biểu Phí Minh Bạch - Không Phí Ẩn - Miễn Phí Duy Trì Gian Hàng',
      icon: DollarSign,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Sàn áp dụng cơ chế phân chia doanh thu cố định và minh bạch qua hệ thống Sổ Cái Kép Kế Toán (Double-Entry Ledger):
          </p>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span>Doanh thu Seller thực nhận:</span>
              <strong style={{ color: '#059669', fontSize: '15px' }}>90% Giá Trị Đơn Hàng</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Phí hoa hồng vận hành sàn:</span>
              <strong style={{ color: '#ec4899', fontSize: '15px' }}>10% (Đã gồm chi phí cổng thanh toán)</strong>
            </div>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748b' }}>
            Sàn KHÔNG thu phí mở gian hàng, KHÔNG thu phí duy trì hàng tháng. Phí hoa hồng chỉ được trừ khi đơn hàng hoàn tất giao thành công và hết thời hạn khiếu nại.
          </p>
        </div>
      )
    },
    'cam-nang-ban-hang': {
      title: 'Cẩm Nang Bán Hàng Mỹ Phẩm An Toàn & Chuẩn Y Khoa',
      subtitle: 'Quy Chuẩn Chụp Ảnh Sản Phẩm, Tư Vấn Hoạt Chất & Hạn Dùng',
      icon: BookOpen,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
            Các hướng dẫn quan trọng giúp Seller đạt doanh số cao và giữ vững điểm đánh giá Shop 4.9★:
          </p>
          <ol style={{ paddingLeft: '20px', lineHeight: 1.7, color: '#475569', fontSize: '13px' }}>
            <li><strong>Minh bạch số lô và HSD:</strong> Luôn cập nhật đúng số lô (Lot No) và hạn sử dụng (EXP) theo chuẩn FEFO. Tuyệt đối không gửi hàng cận date dưới 6 tháng cho khách trừ khi có ghi chú xả kho.</li>
            <li><strong>Chụp ảnh rõ ràng tem phụ:</strong> Hình ảnh sản phẩm phải có tối thiểu 1 ảnh chụp rõ nhãn phụ tiếng Việt và số tiếp nhận CBMP.</li>
            <li><strong>Tư vấn chuẩn da liễu:</strong> Sử dụng công cụ AI INCI Assistant để giải thích đúng nồng độ hoạt chất (ví dụ: Salicylic Acid 2% dành cho da dầu mụn).</li>
          </ol>
        </div>
      )
    },
    'api-kho-van': {
      title: 'Hệ Thống API Kết Nối Kho Vận (OpenAPI Mẫu)',
      subtitle: 'Tích Hợp Tự Động Với ERP, POS KiotViet, Sapo, Haravan, WMS',
      icon: Code2,
      content: (
        <div>
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '12px' }}>
            Aura Beauty Mall cung cấp chuẩn kết nối RESTful API & Webhook thời gian thực cho các đối tác quản lý kho vận:
          </p>
          <div style={{ background: '#0f172a', color: '#38bdf8', borderRadius: '10px', padding: '14px', fontFamily: 'monospace', fontSize: '11.5px', overflowX: 'auto', marginBottom: '14px' }}>
            <span style={{ color: '#94a3b8' }}>// OpenAPI 3.0 Webhook Order Created Spec</span><br />
            POST /api/v1/webhooks/orders.split<br />
            Headers: Authorization: Bearer &#123;SELLER_API_KEY&#125;<br />
            &#123;<br />
            &nbsp;&nbsp;"event": "SUB_ORDER_ASSIGNED",<br />
            &nbsp;&nbsp;"subOrderId": "SUB-8821",<br />
            &nbsp;&nbsp;"shopId": "shop-001",<br />
            &nbsp;&nbsp;"warehouseRouting": "WH_SOUTH_HCM",<br />
            &nbsp;&nbsp;"items": [&#123; "sku": "INNI-GT-80ML", "qty": 1 &#125;]<br />
            &#125;
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748b' }}>Tài liệu Swagger UI tích hợp sẵn tại cổng lập trình viên: <code>https://developer.aurabeauty.vn/docs</code></p>
        </div>
      )
    },
    'bo-cong-thuong': {
      title: 'Chứng Nhận Đã Đăng Ký Bộ Công Thương',
      subtitle: 'Website Thương Mại Điện Tử Bán Hàng Hợp Pháp Đã Được Thẩm Tra',
      icon: CheckCircle2,
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900 }}>
              BCT
            </div>
            <div>
              <strong style={{ fontSize: '15px', color: '#065f46', display: 'block' }}>ĐÃ THÔNG BÁO VỚI BỘ CÔNG THƯƠNG</strong>
              <span style={{ fontSize: '12.5px', color: '#047857' }}>Số xác nhận: 2024-001928/TB-BCT ngày 20/04/2024</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            Hệ thống tuân thủ đầy đủ các quy định về công bố thông tin hàng hóa, bảo vệ quyền lợi người tiêu dùng và trách nhiệm xử lý vi phạm sở hữu trí tuệ theo Nghị định 52/2013/NĐ-CP và Nghị định 85/2021/NĐ-CP.
          </p>
        </div>
      )
    },
    'pci-dss': {
      title: 'Chứng Chỉ Bảo Mật Thanh Toán PCI-DSS Level 1',
      subtitle: 'Tiêu Chuẩn Bảo Mật Dữ Liệu Thẻ Quốc Tế & Quỹ Ký Quỹ Escrow',
      icon: ShieldCheck,
      content: (
        <div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
            <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block', marginBottom: '4px' }}>🛡️ CHỨNG NHẬN PCI-DSS LEVEL 1</strong>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>Cấp độ bảo mật cao nhất dành cho các cổng thanh toán tài chính xử lý hơn 6 triệu giao dịch/năm.</p>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
            Mọi giao dịch thanh toán trực tuyến qua thẻ nội địa NAPAS, thẻ quốc tế Visa/Mastercard hoặc ví điện tử đều được trung gian qua cổng thanh toán được cấp phép bởi Ngân Hàng Nhà Nước Việt Nam.
          </p>
        </div>
      )
    },
    'faq': {
      title: 'Câu Hỏi Thường Gặp (FAQ)',
      subtitle: 'Giải Đáp Thắc Mắc Về Đơn Hàng, Vận Chuyển & Sử Dụng Sản Phẩm',
      icon: HelpCircle,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { q: 'Làm sao để biết mỹ phẩm tôi mua là 100% chính hãng?', a: 'Tất cả sản phẩm đều có số tiếp nhận CBMP của Bộ Y Tế in trên nhãn phụ và tem vỡ chống giả có thể quét mã QR xác thực.' },
            { q: 'Nếu da tôi bị kích ứng sau khi dùng thì xử lý thế nào?', a: 'Ngừng sử dụng ngay và liên hệ hotline 1900 6868 hoặc mục Khiếu nại để được Bác sĩ tư vấn làm dịu và hoàn tiền 100% trong 7 ngày.' },
            { q: 'Thời gian giao hàng là bao lâu?', a: 'Giao hỏa tốc 2 giờ tại nội thành Hà Nội & TP.HCM. Các tỉnh thành khác giao từ 1 - 3 ngày làm việc.' },
            { q: 'Tính năng Thử Màu AR có tính phí không?', a: 'Tính năng Thử màu thực tế ảo (Virtual Try-On) và AI Soi da hoàn toàn miễn phí cho tất cả người dùng.' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>❓ {item.q}</strong>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{item.a}</p>
            </div>
          ))}
        </div>
      )
    }
  };

  const article = ARTICLES[articleSlug] || ARTICLES['gioi-thieu'];
  const Icon = article.icon;

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            position: 'relative',
            padding: '28px'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {article.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                {article.subtitle}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '24px' }}>
            {article.content}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <SpringButton variant="primary" onClick={onClose}>
              Đóng Cửa Sổ
            </SpringButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
