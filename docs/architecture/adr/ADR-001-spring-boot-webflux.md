# ADR-001: Lựa Chọn Spring Boot 3 + Spring WebFlux Cho Kiến Trúc Reactive

## Bối cảnh (Context)
Hệ thống sàn thương mại điện tử cần xử lý lưu lượng truy cập cao, nhiều thao tác I/O bất đồng bộ (giao tiếp Kafka, truy vấn CSDL phi chặn, streaming câu trả lời trợ lý AI qua Server-Sent Events). Nhóm phát triển chỉ gồm 01 lập trình viên, cần cân nhắc giữa Spring Boot 3 WebFlux (Project Reactor) và Quarkus (Mutiny/Reactive).

## Các phương án cân nhắc (Options)
1. **Quarkus (Reactive with Mutiny):** Khởi động cực nhanh, tối ưu tài nguyên bộ nhớ RAM, hỗ trợ compile native tốt. Tuy nhiên, hệ sinh thái tài liệu tiếng Việt/Anh ít phong phú hơn, việc cấu hình các trường hợp đặc biệt cho sinh viên/một người phát triển tốn nhiều thời gian gỡ lỗi.
2. **Spring Boot 3 + Spring WebFlux (Reactor):** Hệ sinh thái đồ sộ, tích hợp phong phú (Spring Cloud Gateway, Spring Security Reactive, R2DBC, Reactor Kafka), tài liệu và cộng đồng hỗ trợ lớn, quen thuộc với sinh viên CNTT.

## Quyết định (Decision)
Chọn **Spring Boot 3 + Spring WebFlux** làm nền tảng công nghệ chính cho tất cả các backend services. Tuân thủ nghiêm ngặt nguyên tắc **100% Non-blocking I/O** (không sử dụng JDBC, không dùng `block()`, kiểm soát bằng BlockHound).

## Hệ quả (Consequences)
- **Tích cực:** Tận dụng được sự trưởng thành của hệ sinh thái Spring, dễ dàng cấu hình bảo mật JWT Reactive, Gateway, và tích hợp thư viện AI (LangChain4j). Giảm thiểu rủi ro tắc nghẽn tiến độ đồ án một người.
- **Tiêu cực (Đánh đổi):** Bộ nhớ RAM tiêu thụ cao hơn và thời gian khởi động lâu hơn so với Quarkus. Đòi hỏi kỹ luật nghiêm ngặt khi viết mã bất đồng bộ để tránh vô tình block luồng Reactor Netty EventLoop.
