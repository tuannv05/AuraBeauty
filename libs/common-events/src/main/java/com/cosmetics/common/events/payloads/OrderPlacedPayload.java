package com.cosmetics.common.events.payloads;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class OrderPlacedPayload {
    private UUID orderId;
    private UUID buyerId;
    private BigDecimal totalAmount;
    private List<SubOrderDto> subOrders;
    private List<ItemDto> items;

    public static class SubOrderDto {
        private UUID subOrderId;
        private UUID shopId;
        private BigDecimal subTotal;

        public SubOrderDto() {}
        public SubOrderDto(UUID subOrderId, UUID shopId, BigDecimal subTotal) {
            this.subOrderId = subOrderId;
            this.shopId = shopId;
            this.subTotal = subTotal;
        }

        public UUID getSubOrderId() { return subOrderId; }
        public void setSubOrderId(UUID subOrderId) { this.subOrderId = subOrderId; }
        public UUID getShopId() { return shopId; }
        public void setShopId(UUID shopId) { this.shopId = shopId; }
        public BigDecimal getSubTotal() { return subTotal; }
        public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
    }

    public static class ItemDto {
        private UUID subOrderId;
        private String skuCode;
        private String productName;
        private int quantity;
        private BigDecimal unitPrice;

        public ItemDto() {}
        public ItemDto(UUID subOrderId, String skuCode, String productName, int quantity, BigDecimal unitPrice) {
            this.subOrderId = subOrderId;
            this.skuCode = skuCode;
            this.productName = productName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        public UUID getSubOrderId() { return subOrderId; }
        public void setSubOrderId(UUID subOrderId) { this.subOrderId = subOrderId; }
        public String getSkuCode() { return skuCode; }
        public void setSkuCode(String skuCode) { this.skuCode = skuCode; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }

    public OrderPlacedPayload() {}

    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public UUID getBuyerId() { return buyerId; }
    public void setBuyerId(UUID buyerId) { this.buyerId = buyerId; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public List<SubOrderDto> getSubOrders() { return subOrders; }
    public void setSubOrders(List<SubOrderDto> subOrders) { this.subOrders = subOrders; }
    public List<ItemDto> getItems() { return items; }
    public void setItems(List<ItemDto> items) { this.items = items; }
}
