package com.greenlife.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private List<T> items;

    private long total;

    private int page;

    private int limit;

    private int totalPages;

    public static <T> PageResponse<T> of(List<T> items, long total, int page, int limit) {
        return PageResponse.<T>builder()
                .items(items)
                .total(total)
                .page(page)
                .limit(limit)
                .totalPages((int) Math.ceil((double) total / limit))
                .build();
    }
}
