package com.cosmetics.payment.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Immutable Double-Entry Ledger Aggregate Root.
 * Invariant: Sum of Debit entries MUST strictly equal Sum of Credit entries.
 * Default Platform Commission: 10% (PLATFORM_REVENUE), Seller Net: 90% (SELLER_PAYABLE).
 */
public final class DoubleEntryLedger {

    public static final BigDecimal COMMISSION_RATE = new BigDecimal("0.10"); // 10%
    public static final UUID PLATFORM_ACCOUNT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private DoubleEntryLedger() {}

    public record TransactionBatch(
        UUID transactionId,
        EntryType entryType,
        List<LedgerJournalEntry> entries,
        BigDecimal totalDebit,
        BigDecimal totalCredit
    ) {
        public TransactionBatch {
            if (entries == null || entries.isEmpty()) {
                throw new IllegalStateException("Transaction batch cannot be empty");
            }
            if (totalDebit.compareTo(totalCredit) != 0) {
                throw new IllegalStateException("Double-Entry Invariant Violated! Total Debit (" + totalDebit + ") != Total Credit (" + totalCredit + ")");
            }
        }
    }

    /**
     * Hạch toán ký quỹ khi thanh toán thành công:
     * NỢ (Debit): BUYER_ACCOUNT
     * CÓ (Credit): ESCROW_HOLDING
     */
    public static TransactionBatch recordEscrowDeposit(UUID transactionId, UUID buyerId, BigDecimal amount, String desc) {
        validatePositive(amount);
        List<LedgerJournalEntry> entries = List.of(
            LedgerJournalEntry.debit(transactionId, AccountType.BUYER_ACCOUNT, buyerId, amount, desc),
            LedgerJournalEntry.credit(transactionId, AccountType.ESCROW_HOLDING, PLATFORM_ACCOUNT_ID, amount, desc)
        );
        return new TransactionBatch(transactionId, EntryType.ORDER_PAYMENT, entries, amount, amount);
    }

    /**
     * Hạch toán giải ngân khi đơn hàng hoàn tất (DELIVERED):
     * NỢ (Debit): ESCROW_HOLDING (100% số tiền đơn)
     * CÓ (Credit): PLATFORM_REVENUE (10% hoa hồng sàn)
     * CÓ (Credit): SELLER_PAYABLE (90% công nợ Shop)
     */
    public static TransactionBatch recordEscrowSettlement(UUID transactionId, UUID shopId, BigDecimal grossAmount, String desc) {
        validatePositive(grossAmount);

        // 10% hoa hồng sàn
        BigDecimal commission = grossAmount.multiply(COMMISSION_RATE).setScale(0, RoundingMode.HALF_UP);
        // 90% công nợ người bán (bằng tổng trừ đi hoa hồng để đảm bảo không lệch 1 xu)
        BigDecimal sellerNet = grossAmount.subtract(commission);

        List<LedgerJournalEntry> entries = new ArrayList<>();
        // Nợ Escrow giải phóng tiền
        entries.add(LedgerJournalEntry.debit(transactionId, AccountType.ESCROW_HOLDING, PLATFORM_ACCOUNT_ID, grossAmount, desc + " - Release Escrow"));
        // Có Platform Revenue (10%)
        entries.add(LedgerJournalEntry.credit(transactionId, AccountType.PLATFORM_REVENUE, PLATFORM_ACCOUNT_ID, commission, desc + " - Platform 10% Commission"));
        // Có Seller Payable (90%)
        entries.add(LedgerJournalEntry.credit(transactionId, AccountType.SELLER_PAYABLE, shopId, sellerNet, desc + " - Seller 90% Payout"));

        BigDecimal totalCredit = commission.add(sellerNet);
        return new TransactionBatch(transactionId, EntryType.COMMISSION_FEE, List.copyOf(entries), grossAmount, totalCredit);
    }

    /**
     * Hạch toán hoàn tiền cho khách (REFUND):
     * NỢ (Debit): ESCROW_HOLDING
     * CÓ (Credit): BUYER_ACCOUNT
     */
    public static TransactionBatch recordRefund(UUID transactionId, UUID buyerId, BigDecimal refundAmount, String desc) {
        validatePositive(refundAmount);
        List<LedgerJournalEntry> entries = List.of(
            LedgerJournalEntry.debit(transactionId, AccountType.ESCROW_HOLDING, PLATFORM_ACCOUNT_ID, refundAmount, desc + " - Refund Release"),
            LedgerJournalEntry.credit(transactionId, AccountType.BUYER_ACCOUNT, buyerId, refundAmount, desc + " - Buyer Refunded")
        );
        return new TransactionBatch(transactionId, EntryType.REFUND, entries, refundAmount, refundAmount);
    }

    private static void validatePositive(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Ledger amount must be strictly positive: " + amount);
        }
    }
}
