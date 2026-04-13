package com.ctgroup.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignPermissionsRequest {

    @NotEmpty(message = "Permission IDs are required")
    private List<String> permissionIds;
}
