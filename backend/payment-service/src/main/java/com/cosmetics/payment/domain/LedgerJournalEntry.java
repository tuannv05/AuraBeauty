package com.cosmetics.payment.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Journal Entry Line in Double-Entry Bookkeeping.
 * Pure Java 21 Record.
 */
public record LedgerJournalEntry(
    UUID id,
    UUID transactionId,
    AccountType accountType,
    UUID accountOwnerId, // Shop ID, Buyer ID, or Platform System ID
    BigDecimal debitAmount,
    BigDecimal creditAmount,
    String description,
    Instant createdAt
) {
    public LedgerJournalEntry {
        if (transactionId == null) {
            throw new IllegalArgumentException("Transaction ID cannot be null");
        }
        if (debitAmount == null || debitAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Debit amount cannot be negative");
        }
        if (creditAmount == null || creditAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Credit amount cannot be negative");
        }
        // Một dòng sổ cái hoặc ghi Nợ (Debit > 0, Credit == 0) hoặc ghi Có (Credit > 0, Debit == 0)
        boolean hasDebit = debitAmount.compareTo(BigDecimal.ZERO) > 0;
        boolean hasCredit = creditAmount.compareTo(BigDecimal.ZERO) > 0;
        if ((hasDebit && hasCredit) || (!hasDebit && !hasCredit)) {
            throw new IllegalArgumentException("Ledger entry must have either positive debit OR positive credit, not both or neither");
        }
    }

    public static LedgerJournalEntry debit(UUID transactionId, AccountType account, UUID ownerId, BigDecimal amount, String desc) {
        return new LedgerJournalEntry(UUID.randomUUID(), transactionId, account, ownerId, amount, BigDecimal.ZERO, desc, Instant.now());
    }

    public static LedgerJournalEntry credit(UUID transactionId, AccountType account, UUID ownerId, BigDecimal amount, String desc) {
        return new LedgerJournalEntry(UUID.randomUUID(), transactionId, account, ownerId, BigDecimal.ZERO, amount, desc, Instant.now());
    }
}
