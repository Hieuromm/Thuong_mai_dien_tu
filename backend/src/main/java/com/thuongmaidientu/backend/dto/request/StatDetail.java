package com.thuongmaidientu.backend.dto.request;
import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor
public class StatDetail {
    private String id;
    private String label;
    private double value;
    private double growth;
    private String unit;
}