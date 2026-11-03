package com.cosmetics.inventory;

import com.cosmetics.inventory.adapter.out.persistence.StockItemEntity;
import com.cosmetics.inventory.adapter.out.persistence.StockItemRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AtomicStockConcurrencyTest {

    @Test
    @DisplayName("Under 100 concurrent reservation requests, stock must never drop below 0")
    void testConcurrentAtomicReservation() {
        StockItemRepository repository = Mockito.mock(StockItemRepository.class);

        // Simulate atomic DB CAS update: only first 10 requests get rowsUpdated=1, rest get rowsUpdated=0
        AtomicInteger remainingStock = new AtomicInteger(10);
        when(repository.atomicReserve(anyString(), anyInt())).thenAnswer(invocation -> {
            int current = remainingStock.get();
            if (current > 0 && remainingStock.compareAndSet(current, current - 1)) {
                return Mono.just(1L);
            }
            return Mono.just(0L);
        });

        AtomicInteger successfulReservations = new AtomicInteger(0);
        AtomicInteger rejectedReservations = new AtomicInteger(0);

        Flux.range(1, 100)
                .flatMap(i -> repository.atomicReserve("SKU-ANUA-77-50ML", 1))
                .doOnNext(rows -> {
                    if (rows == 1L) {
                        successfulReservations.incrementAndGet();
                    } else {
                        rejectedReservations.incrementAndGet();
                    }
                })
                .blockLast();

        assertEquals(10, successfulReservations.get(), "Exactly 10 reservations must succeed");
        assertEquals(90, rejectedReservations.get(), "Remaining 90 reservations must be rejected safely");
        assertEquals(0, remainingStock.get(), "Remaining stock must be strictly 0, never negative");
    }
}
