package com.cosmetics.payment.adapter.out.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table("ledger_entries")
public class LedgerEntryEntity {
    @Id
    private UUID id;

    @Column("transaction_id")
    private UUID transactionId; // paymentId or subOrderId

    @Column("account_debit")
    private String accountDebit;

    @Column("account_credit")
    private String accountCredit;

    @Column("amount")
    private BigDecimal amount;

    @Column("entry_type")
    private String entryType; // ORDER_PAYMENT, COMMISSION_FEE, SELLER_PAYOUT, REFUND

    @Column("note")
    private String note;

    @Column("recorded_at")
    private Instant recordedAt;

    public LedgerEntryEntity() {}

    public LedgerEntryEntity(UUID id, UUID transactionId, String accountDebit, String accountCredit, BigDecimal amount, String entryType, String note) {
        this.id = id != null ? id : UUID.randomUUID();
        this.transactionId = transactionId;
        this.accountDebit = accountDebit;
        this.accountCredit = accountCredit;
        this.amount = amount;
        this.entryType = entryType;
        this.note = note;
        this.recordedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getTransactionId() { return transactionId; }
    public void setTransactionId(UUID transactionId) { this.transactionId = transactionId; }
    public String getAccountDebit() { return accountDebit; }
    public void setAccountDebit(String accountDebit) { this.accountDebit = accountDebit; }
    public String getAccountCredit() { return accountCredit; }
    public void setAccountCredit(String accountCredit) { this.accountCredit = accountCredit; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getEntryType() { return entryType; }
    public void setEntryType(String entryType) { this.entryType = entryType; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }
}
