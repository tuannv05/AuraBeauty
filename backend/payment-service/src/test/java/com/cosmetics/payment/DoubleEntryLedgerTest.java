package com.cosmetics.payment;

import com.cosmetics.payment.domain.DoubleEntryLedger;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class DoubleEntryLedgerTest {

    @Test
    @DisplayName("Escrow settlement must enforce sum(Debit) == sum(Credit) with exact 10% platform commission and 90% seller payable")
    void testEscrowSettlementDoubleEntryInvariant() {
        UUID txId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        BigDecimal grossAmount = new BigDecimal("490000"); // 490.000 VNĐ

        DoubleEntryLedger.TransactionBatch batch = DoubleEntryLedger.recordEscrowSettlement(
            txId, shopId, grossAmount, "Settlement for SubOrder SUB-001"
        );

        // Kiểm tra phương trình bất biến Nợ = Có
        assertEquals(0, batch.totalDebit().compareTo(batch.totalCredit()), "Total Debit must equal Total Credit");
        assertEquals(0, grossAmount.compareTo(batch.totalDebit()), "Total Debit must equal gross amount");

        // Hoa hồng sàn 10%: 49.000 VNĐ
        BigDecimal expectedCommission = new BigDecimal("49000");
        // Người bán nhận 90%: 441.000 VNĐ
        BigDecimal expectedSellerNet = new BigDecimal("441000");

        assertEquals(3, batch.entries().size());
        assertEquals(expectedCommission, batch.entries().get(1).creditAmount());
        assertEquals(expectedSellerNet, batch.entries().get(2).creditAmount());
    }
}
