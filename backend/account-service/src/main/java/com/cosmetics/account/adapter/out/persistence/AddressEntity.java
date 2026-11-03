package com.cosmetics.account.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("user_addresses")
public class AddressEntity implements Persistable<UUID> {
    @Id
    private UUID id;

    @Column("user_id")
    private UUID userId;

    @Column("recipient_name")
    private String recipientName;

    @Column("phone")
    private String phone;

    @Column("province")
    private String province;

    @Column("district")
    private String district;

    @Column("ward")
    private String ward;

    @Column("street_address")
    private String streetAddress;

    @Column("is_default")
    private Boolean isDefault;

    @Column("label")
    private String label;

    @Column("created_at")
    private Instant createdAt;

    @Transient
    private boolean isNew = false;

    public AddressEntity() {}

    public AddressEntity(UUID id, UUID userId, String recipientName, String phone, String province, String district, String ward, String streetAddress, Boolean isDefault, String label) {
        this.id = id != null ? id : UUID.randomUUID();
        this.userId = userId;
        this.recipientName = recipientName;
        this.phone = phone;
        this.province = province;
        this.district = district;
        this.ward = ward;
        this.streetAddress = streetAddress;
        this.isDefault = isDefault != null ? isDefault : false;
        this.label = label != null ? label : "HOME";
        this.createdAt = Instant.now();
        this.isNew = true;
    }

    @Override
    public boolean isNew() {
        return isNew || id == null;
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }
    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
